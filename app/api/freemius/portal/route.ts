import {getFreemiusClient} from "../../../../libs/freemius";
import config from "../../../../config.server";
import {createSupabaseAdminClient} from "../../../../libs/supabaseAdmin";

function getPortalEndpoint(request: Request) {
  const url = new URL(request.url);
  return `${url.origin}/api/freemius/portal`;
}

async function handlePortalRequest(request: Request) {
  const freemius = getFreemiusClient();
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) {
    return new Response("Unauthorized", {status: 401});
  }

  const supabase = createSupabaseAdminClient();
  const {data, error} = await supabase.auth.getUser(token);
  if (error || !data?.user?.email) {
    return new Response("Unauthorized", {status: 401});
  }
  const email = data.user.email;

  const getUser = async () => {
    return {email};
  };

  return freemius.customerPortal.request.process(
    {
      getUser,
      portalEndpoint: getPortalEndpoint(request),
      isSandbox: Boolean(config.freemius?.isSandbox)
    },
    request
  );
}

export async function GET(request: Request) {
  return handlePortalRequest(request);
}

export async function POST(request: Request) {
  return handlePortalRequest(request);
}
