import { Reply } from "./reply";
import { MetaInfo } from "./metaInfo";

export interface Discussion {
    
    meta?:MetaInfo

    onEntity?: string;

    comment?: string;

    replies?: Reply[];

    _id?:string;
    
}