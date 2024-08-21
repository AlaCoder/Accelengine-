-- liquibase formatted sql
-- changeset marwen.hanzouli:1

CREATE SEQUENCE public.dictionary_type
    INCREMENT BY 5
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
	CACHE 1
	NO CYCLE;
ALTER SEQUENCE public.dictionary_type OWNER TO postgres;
GRANT ALL ON SEQUENCE public.dictionary_type TO postgres;

CREATE SEQUENCE public.dictionary_value
    INCREMENT BY 5
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
	CACHE 1
	NO CYCLE;
ALTER SEQUENCE public.dictionary_value OWNER TO postgres;
GRANT ALL ON SEQUENCE public.dictionary_value TO postgres;

CREATE TABLE public.std_dictionary_type (
                                            id int8 NOT NULL,
                                            code varchar(255) NULL,
                                            deleted bool NULL,
                                            status bool NULL,
                                            description varchar(255) NULL,
                                            "label" varchar(255) NOT NULL,
                                            other_values bool NOT NULL,
                                            val_bool1label varchar(255) NULL,
                                            val_bool2label varchar(255) NULL,
                                            val_bool3label varchar(255) NULL,
                                            val_date1label varchar(255) NULL,
                                            val_date2label varchar(255) NULL,
                                            val_date3label varchar(255) NULL,
                                            val_int1label varchar(255) NULL,
                                            val_int2label varchar(255) NULL,
                                            val_int3label varchar(255) NULL,
                                            val_string1label varchar(255) NULL,
                                            val_string2label varchar(255) NULL,
                                            val_string3label varchar(255) NULL,
                                            CONSTRAINT std_dictionary_type_pkey PRIMARY KEY (id)
);
ALTER TABLE public.std_dictionary_type OWNER TO postgres;
GRANT ALL ON TABLE public.std_dictionary_type TO postgres;

CREATE TABLE public.std_dictionary_value (
                                             id int8 NOT NULL,
                                             code varchar(255) NULL,
                                             deleted bool NULL,
                                             status bool NULL,
                                             created_by varchar(50) NOT NULL,
                                             created_date timestamp NULL,
                                             last_modified_by varchar(50) NULL,
                                             last_modified_date timestamp NULL,
                                             description varchar(255) NULL,
                                             "label" varchar(255) NOT NULL,
                                             val_bool1 bool default false NOT NULL,
                                             val_bool2 bool default false NOT NULL,
                                             val_bool3 bool default false NOT NULL,
                                             val_date1 timestamp NULL,
                                             val_date2 timestamp NULL,
                                             val_date3 timestamp NULL,
                                             val_int1 int4 default 0 NULL,
                                             val_int2 int4 default 0 NULL,
                                             val_int3 int4 default 0 NULL,
                                             val_string1 varchar(255) NULL,
                                             val_string2 varchar(255) NULL,
                                             val_string3 varchar(255) NULL,
                                             "type" int8 NULL,
                                             CONSTRAINT std_dictionary_value_pkey PRIMARY KEY (id),
                                             CONSTRAINT fk2fcc608mjpu25opa7l6daxywy FOREIGN KEY ("type") REFERENCES public.std_dictionary_type(id)
);
ALTER TABLE public.std_dictionary_value OWNER TO postgres;
GRANT ALL ON TABLE public.std_dictionary_value TO postgres;
