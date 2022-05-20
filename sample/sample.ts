/**
 * DONT EDIT THIS FILE
 * This generated by @privyid/nugrpc-codegen
 */
import { useApi, ApiResponse, AxiosRequestConfig } from '@privyid/nugrpc-api'

export const $api = useApi().create({ prefixURL: '/' })

export type NormalMessage = {
  field_bool: boolean;
  field_double: number;
  field_float: number;
  field_int32: number;
  field_uint32: number;
  field_sint32: number;
  field_fixed32: number;
  field_sfixed32: number;
  field_string: string;
  field_int64: string;
  field_uint64: string;
  field_sint64: string;
  field_fixed64: string;
  field_sfixed64: string;
  field_bytes: string;
}

export type RepeatedMessage = {
  messages: Array<NormalMessage>;
}

export enum Statuses {
  SUCCESS = 1,
  FAILED = 2,
}

export type MapField = {
  permission: Record<string, boolean>;
  status: Record<string, NormalMessage>;
}

export type SampleMessageSubMessage = {
  name: string;
}

export type SampleMessage = {
  field: string;
} & (
  // oneOf: 'test_oneof'
  {
    test_oneof: 'name';
    name: string;
  } | {
    test_oneof: 'sub_message';
    sub_message: SampleMessageSubMessage;
  }
)

export type SearchRequest = {
  page: number;
  query: string;
}

export type SearchResponse = {
  data: Array<NormalMessage>;
}

export const SearchService = {

  async search (body: SearchRequest, config?: AxiosRequestConfig): ApiResponse<SearchResponse> {
    return $api.post('/sample.transformer.ts.SearchService/Search', body, config)
  },
}
