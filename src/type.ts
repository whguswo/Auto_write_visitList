export interface Query{
    date:{
        '$gte':string|Date;
        '$lte':string|Date;
    }
};

export interface UserNet{
    name:string;
    address:string;
    phone:string;
    type:string;
};

export interface UserQuery extends UserNet{
    hash:string
};