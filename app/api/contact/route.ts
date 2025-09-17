export async function POST(req: Request){
  try{
    const body = await req.json();
    console.log("[contact]", body); // 本番はメール/チケット化など
    return new Response(JSON.stringify({ok:true}), { headers:{ "Content-Type":"application/json"}});
  }catch{
    return new Response(JSON.stringify({ok:false}), { status:400, headers:{ "Content-Type":"application/json"}});
  }
}
