export async function onRequest(context) {
  // 1. ดึง URL ปลายทางจาก query parameter
  const url = new URL(context.request.url);
  const targetUrl = url.searchParams.get('url');

  // 2. ถ้าไม่มี URL ให้ส่ง error กลับไป
  if (!targetUrl) {
    return new Response('Missing "url" query parameter', { status: 400 });
  }

  // 3. ตรวจสอบความปลอดภัย (Whitelist) อนุญาตเฉพาะโดเมนที่กำหนด
  const allowedHost = 'clpp-radar.onwr.go.th';
  try {
    const targetHost = new URL(targetUrl).hostname;
    if (targetHost !== allowedHost) {
      return new Response('Forbidden: Target domain not allowed', { status: 403 });
    }
  } catch (e) {
    return new Response('Invalid URL', { status: 400 });
  }

  // 4. ส่งต่อ Request ไปยัง API ปลายทาง
  const response = await fetch(targetUrl, {
    method: context.request.method,
    headers: context.request.headers,
  });

  // 5. คัดลอก Response และเติม CORS Headers ที่จำเป็น
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', '*');

  return newResponse;
}
