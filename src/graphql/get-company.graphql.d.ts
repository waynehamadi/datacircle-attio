/**
 * ****************************************************
 * THIS FILE IS AUTO-GENERATED AT DEVELOPMENT TIME.
 *
 * DO NOT EDIT DIRECTLY OR COMMIT IT TO SOURCE CONTROL.
 * ****************************************************
 */
import { Query } from "attio/client";

type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

declare module "./get-company.graphql" {
  export type GetCompanyQueryVariables = Exact<{
    recordId: Scalars["String"]["input"];
  }>;

  export type GetCompanyQuery = {
    company: { name: string | null; domains: Array<string> } | null;
  };

  const value: Query<GetCompanyQueryVariables, GetCompanyQuery>;
  export default value;
}
