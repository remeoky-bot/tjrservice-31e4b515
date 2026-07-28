import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProducts from "./tools/list-products";
import listCustomers from "./tools/list-customers";
import listSales from "./tools/list-sales";
import listRepairs from "./tools/list-repairs";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "nexel-manager-pro-mcp",
  title: "NEXEL Manager Pro",
  version: "0.1.0",
  instructions:
    "Tools for NEXEL Manager Pro — an ERP for phone/IT/repair shops in Madagascar. Use these tools to search products, customers, recent sales and repair tickets. All actions run as the signed-in user under RLS.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProducts, listCustomers, listSales, listRepairs],
});