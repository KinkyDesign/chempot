import { MetaInfo } from "./metaInfo";


export interface Notification{

    meta?: MetaInfo;

    _id?: string;

    type?: string

    answer?: string

    body?: string

    from?: string

    to?: string

    viewed?: Boolean

    owner?: string

    invitationTo?: string

    affiliatedOrg?: string

    entityShared?: string

    organizationShared?: string
    
    resolved?: boolean
    
}

export enum TYPE{
    SIMPLE = "SIMPLE",
    INVITATION = "INVITATION",
    FYI = "FYI",
    SHARE = "SHARE",
    AFFILIATION = "AFFILIATION",
    BROKENAFFILIATION = "BROKENAFFILIATION"
}

export enum ANSWER{
    ACEEPT = "ACCEPT",
    DECLINE = "DECLINE"
}