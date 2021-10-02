export interface Query{
    date:{
        '$gte':string|Date;
        '$lte':string|Date;
    },
    name:string;
    temp:{
        '$gte':string|Number;
        '$lte':string|Number;
    };
};

export interface UserNet{
    name:string;
    address:string;
    phone:string;
    type:string;
};

export interface UserQuery extends UserNet{
    hash:string;
};

export interface searchUserQuery {
    name: string,
    phone: string,
    address: string
}
