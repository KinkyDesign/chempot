package main

import (
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"io"
	"log"
	"os"
	"os/user"
	"path"
	"strings"
	"text/template"
)

const genmsg = "// Code generated by genapi, which is a API generation tool for Gorgonia. DO NOT EDIT."

const (
	apigenOut = "api_gen.go"
	unOpOut   = "operatorPointwise_unary_gen.go"

	// broadcastOpOut = "operations_broadcast.go"
	unaryOps  = "operatorPointwise_unary_const.go"
	binaryOps = "operatorPointwise_binary_const.go"
)

var (
	gopath, gorgonialoc, golgiloc string
)

var funcmap = template.FuncMap{
	"lower": strings.ToLower,
}

var (
	unaryTemplate          *template.Template
	binaryTemplate         *template.Template
	broadcastTemplate      *template.Template
	maybeBroadcastTemplate *template.Template
)

const unaryTemplateRaw = ` // {{.FnName}} performs a pointwise {{lower .FnName}}.
func {{.FnName}}(a *Node) (*Node, error) { return unaryOpNode(newElemUnaryOp({{.OpType}}, a), a) }
`

const binaryTemplateRaw = `// {{.FnName}} performs a pointwise {{lower .FnName}} operation.
{{if .AsSame -}}// retSame indicates if the data type of the return value should be the same as the input data type. It defaults to Bool otherwise.
{{end -}}
func {{.FnName}}(a, b *Node{{if .AsSame}}, retSame bool{{end}}) (*Node, error) { {{if not .AsSame -}}return binOpNode(newElemBinOp({{.OpType}}, a, b), a, b) {{else -}}
	op := newElemBinOp({{.OpType}}, a, b)
	op.retSame = retSame
	return binOpNode(op, a, b)
{{end -}}
}
`

const broadcastTemplateRaw = `// Broadcast{{.FnName}} performs a {{lower .FnName}}. The operation is precomposed with a broadcast such that the shapes matches before operations commence.
func Broadcast{{.FnName}}(a, b *Node{{if .AsSame}}, retSame bool{{end}}, leftPattern, rightPattern []byte)(*Node, error) {
	a2, b2, err := Broadcast(a, b, NewBroadcastPattern(leftPattern, rightPattern))
	if err != nil {
		return nil, err
	}
	return {{.FnName}}(a2, b2{{if .AsSame}}, retSame{{end}})
}
`

// maybeBroadcast is the set of Broadcast functions in Golgi
const maybeBroadcastTemplateRaw = `// Broadcast{{.FnName}} performs a {{lower .FnName}}. The operation is precomposed with a broadcast such that the shapes matches before operations commence.
func Broadcast{{.FnName}}(a, b *G.Node{{if .AsSame}}, retSame bool{{end}}, leftPattern, rightPattern []byte)(*G.Node, error) {
	if a.Shape().Eq(b.Shape()){
		return G.{{.FnName}}(a, b{{if .AsSame}}, retSame{{end}})
	}
	a2, b2, err := G.Broadcast(a, b, G.NewBroadcastPattern(leftPattern, rightPattern))
	if err != nil {
		return nil, err
	}
	return G.{{.FnName}}(a2, b2{{if .AsSame}}, retSame{{end}})
}
`

func init() {
	gopath = os.Getenv("GOPATH")
	// now that go can have a default gopath, this checks that path
	if gopath == "" {
		usr, err := user.Current()
		if err != nil {
			log.Fatal(err)
		}
		gopath = path.Join(usr.HomeDir, "go")
		stat, err := os.Stat(gopath)
		if err != nil {
			log.Fatal(err)
		}
		if !stat.IsDir() {
			log.Fatal("You need to define a $GOPATH")
		}
	}
	gorgonialoc = path.Join(gopath, "src/gorgonia.org/gorgonia")
	golgiloc = path.Join(gopath, "src/gorgonia.org/golgi")
	unaryTemplate = template.Must(template.New("Unary").Funcs(funcmap).Parse(unaryTemplateRaw))
	binaryTemplate = template.Must(template.New("Binary").Funcs(funcmap).Parse(binaryTemplateRaw))
	broadcastTemplate = template.Must(template.New("Broadcast").Funcs(funcmap).Parse(broadcastTemplateRaw))
	maybeBroadcastTemplate = template.Must(template.New("MaybeBroadcast").Funcs(funcmap).Parse(maybeBroadcastTemplateRaw))
}

func generateUnary(outFile io.Writer) {
	// parse operator_unary_const.go
	filename := path.Join(gorgonialoc, unaryOps)
	fset := token.NewFileSet()
	file, err := parser.ParseFile(fset, filename, nil, parser.AllErrors)
	if err != nil {
		log.Fatal(err)
	}

	unaryNames := constTypes(file.Decls, "ʘUnaryOperatorType", "maxʘUnaryOperator")
	for _, v := range unaryNames {
		apiName := strings.Title(strings.TrimSuffix(v, "OpType"))
		// legacy issue
		if apiName == "Ln" {
			apiName = "Log"
		}
		data := struct{ FnName, OpType string }{apiName, v}
		unaryTemplate.Execute(outFile, data)
	}

}

func generateBinary(outFile io.Writer) {
	// parse operator_binary_const.go
	filename := path.Join(gorgonialoc, binaryOps)
	fset := token.NewFileSet()
	file, err := parser.ParseFile(fset, filename, nil, parser.AllErrors)
	if err != nil {
		log.Fatal(err)
	}

	binaryNames := constTypes(file.Decls, "ʘBinaryOperatorType", "maxʘBinaryOpType")
	log.Printf("%v", binaryNames)
	for _, v := range binaryNames {
		apiName := strings.Title(strings.TrimSuffix(v, "OpType"))
		// legacy issue
		switch apiName {
		case "Mul":
			apiName = "HadamardProd"
		case "Div":
			apiName = "HadamardDiv"
		}
		data := struct {
			FnName, OpType string
			AsSame         bool
		}{apiName, v, false}
		switch apiName {
		case "Lt", "Gt", "Lte", "Gte", "Eq", "Ne":
			data.AsSame = true
		}
		binaryTemplate.Execute(outFile, data)
	}
}

func generateBroadcastBinOps(tmpl *template.Template, outFile io.Writer) {
	// parse operator_binary_const.go
	filename := path.Join(gorgonialoc, binaryOps)
	fset := token.NewFileSet()
	file, err := parser.ParseFile(fset, filename, nil, parser.AllErrors)
	if err != nil {
		log.Fatal(err)
	}

	binaryNames := constTypes(file.Decls, "ʘBinaryOperatorType", "maxʘBinaryOpType")
	log.Printf("%v", binaryNames)
	for _, v := range binaryNames {
		apiName := strings.Title(strings.TrimSuffix(v, "OpType"))
		// legacy issue
		switch apiName {
		case "Mul":
			apiName = "HadamardProd"
		case "Div":
			apiName = "HadamardDiv"
		}
		data := struct {
			FnName, OpType string
			AsSame         bool
		}{apiName, v, false}
		switch apiName {
		case "Lt", "Gt", "Lte", "Gte", "Eq", "Ne":
			data.AsSame = true
		}
		tmpl.Execute(outFile, data)
	}
}

func constTypes(decls []ast.Decl, accept, max string) (names []string) {
	for i, decl := range decls {
		log.Printf("DECL %d: %T", i, decl)
		switch d := decl.(type) {
		case *ast.GenDecl:
			if d.Tok.IsKeyword() && d.Tok.String() == "const" {
				log.Printf("\t%v", d.Tok.String())

				// get the type
				if len(d.Specs) == 0 {
					continue
				}

				var typename string
				typ := d.Specs[0].(*ast.ValueSpec).Type
				if typ == nil {
					continue
				}
				if id, ok := typ.(*ast.Ident); ok {
					typename = id.Name
				}
				if typename != accept {
					continue
				}

				for _, spec := range d.Specs {
					name := spec.(*ast.ValueSpec).Names[0].Name
					if name == max {
						continue
					}
					names = append(names, name)
				}
			}
		default:
		}
	}
	return
}

func generateAPI() {
	outFileName := path.Join(gorgonialoc, apigenOut)
	outFile, err := os.OpenFile(outFileName, os.O_CREATE|os.O_TRUNC|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal(err)
	}
	defer outFile.Close()
	fmt.Fprintf(outFile, "package gorgonia\n\n%v\n\n", genmsg)
	generateUnary(outFile)
	generateBinary(outFile)
	generateBroadcastBinOps(broadcastTemplate, outFile)
}

func generateInterfaces() {
	outFileName := path.Join(gorgonialoc, unOpOut)
	outFile, err := os.OpenFile(outFileName, os.O_CREATE|os.O_TRUNC|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal(err)
	}
	defer outFile.Close()
	fmt.Fprintf(outFile, "package gorgonia\n\n%v\n\n", genmsg)
	generateUnaryInterface(outFile)
}

func generateGolgiAPI() {
	outFileName := path.Join(golgiloc, apigenOut)
	outFile, err := os.OpenFile(outFileName, os.O_CREATE|os.O_TRUNC|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal(err)
	}
	defer outFile.Close()
	fmt.Fprintf(outFile, "package golgi\n\n%v\n\n", genmsg)
	generateBroadcastBinOps(maybeBroadcastTemplate, outFile)
}

func main() {
	// generateAPI()
	// generateInterfaces()
	// functionSignatures()
	generateGolgiAPI()
}
