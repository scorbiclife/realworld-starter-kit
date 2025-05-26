create table `user` (
    id bigint not null auto_increment,
    username varchar(64) not null,
    password_hash binary(60),  -- assuming bcrypt (60 octets)
    created_at datetime not null default now(),
    updated_at datetime not null default now(),
    deleted_at datetime default null,
    primary key (id)
);