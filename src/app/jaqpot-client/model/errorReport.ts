/**
 * Jaqpot API
 * Jaqpot v4 (Quattro) is the 4th version of a YAQP, a RESTful web service which can be used to train machine learning models and use them to obtain toxicological predictions for given chemical compounds or engineered nano materials. The project is written in Java8 and JEE7.
 *
 * OpenAPI spec version: 4.0.3
 * Contact: hampos@me.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

// import { ErrorReport } from './errorReport';
import { MetaInfo } from './metaInfo';


/**
 * Error report for various exceptions in the Jaqpot Framework
 */
export interface ErrorReport {
    meta?: MetaInfo;

    ontologicalClasses?: Array<string>;

    visible?: boolean;

    temporary?: boolean;

    featured?: boolean;

    /**
     * Error code
     */
    code?: string;

    /**
     * Who is to blame
     */
    actor?: string;

    /**
     * Short error message
     */
    message?: string;

    /**
     * Details to be used for debugging.
     */
    details?: string;

    /**
     * Accompanying HTTP status.
     */
    httpStatus?: number;

    /**
     * Trace error report.
     */
    trace?: ErrorReport;

    id?: string;

}