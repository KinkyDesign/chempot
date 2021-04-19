// Copyright ©2019 The Gonum Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package testlapack

import (
	"math"
	"testing"

	"golang.org/x/exp/rand"
)

type Dcombssqer interface {
	Dcombssq(scale1, ssq1, scale2, ssq2 float64) (scale, ssq float64)
}

func DcombssqTest(t *testing.T, impl Dcombssqer) {
	const tol = 1e-15

	rnd := rand.New(rand.NewSource(1))
	for i := 0; i < 100; i++ {
		// Generate random, non-negative input, with an occasional NaN.
		var hasNaN bool
		scale1 := rnd.Float64()
		var ssq1 float64
		if rnd.Float64() < 0.5 {
			ssq1 = math.NaN()
			hasNaN = true
		} else {
			ssq1 = rnd.Float64()
		}

		scale2 := rnd.Float64()
		var ssq2 float64
		if rnd.Float64() < 0.5 {
			ssq2 = math.NaN()
			hasNaN = true
		} else {
			ssq2 = rnd.Float64()
		}

		switch rnd.Intn(4) {
		case 0:
			scale1 = 0
		case 1:
			scale2 = 0
		case 2:
			scale1, scale2 = 0, 0
		}

		// Compute scale and ssq such that
		//  scale^2 * ssq := scale1^2 * ssq1 + scale2^2 * ssq2
		scale, ssq := impl.Dcombssq(scale1, ssq1, scale2, ssq2)

		if hasNaN {
			if !math.IsNaN(ssq) {
				t.Errorf("Case %v: unexpected ssq; got %v, want NaN", i, ssq)
			}
			continue
		}

		// Compute the expected result in a non-sophisticated way and
		// compare against the result we got.
		want := scale1*scale1*ssq1 + scale2*scale2*ssq2
		got := scale * scale * ssq
		if math.Abs(want-got) >= tol {
			t.Errorf("Case %v: unexpected result; got %v, want %v", i, got, want)
		}
	}
}
