import { GoogleGenerativeAI } from "@google/generative-ai"

export const maxDuration = 30

export async function POST(req: Request) { //ฟังก์ชันที่จัดการคำขอประเภท POST ที่ส่งมายัง /api/chat req: Request // คืออ็อบเจกต์คำขอ (request object) ที่มีข้อมูลทั้งหมดที่ส่งมาจากฝั่งไคลเอนต์
  try { //try จะถูกพยายามเรียกใช้ หากเกิดข้อผิดพลาดใดๆ ขึ้นภายในบล็อก try การทำงานจะถูกส่งไปยังบล็อก catch เพื่อจัดการข้อผิดพลาดนั้น
    const { messages } = await req.json() //body ของคำขอ ที่ส่งมา (ซึ่งคาดว่าจะเป็น JSON) และแยกข้อมูล messages ออกมา await req.json() จะรอจนกว่า body ของคำขอจะถูกแปลงเป็นอ็อบเจกต์ JavaScript

    // Initialize the Google Generative AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Get the latest message from the user
    const latestMessage = messages[messages.length - 1]?.content || "" //ดึง ข้อความล่าสุด จากอาร์เรย์ messages ที่ได้รับมาจากฝั่ง frontend
    //messages.length - 1 คือ index ของข้อความสุดท้าย
    //?.content เป็น Optional Chaining ที่ช่วยป้องกันข้อผิดพลาดหาก messages ว่างเปล่า หรือ ข้อความสุดท้ายไม่มี property content
    // || "" จะกำหนดค่าเป็น string ว่าง ("") หาก latestMessage เป็น null หรือ undefined
    // Generate content
    const result = await model.generateContent(latestMessage) //นี่คือหัวใจหลักของ API route นี้: การเรียกใช้ โมเดล Gemini AI เพื่อสร้างข้อความตอบกลับ
    //model.generateContent(latestMessage) ส่งข้อความล่าสุดของผู้ใช้ไปยังโมเดล
    //await รอจนกว่าโมเดลจะประมวลผลเสร็จและส่งผลลัพธ์กลับมา
    const response = await result.response //จาก result ที่ได้มา เราเข้าถึงอ็อบเจกต์ response ซึ่งเป็นส่วนที่บรรจุคำตอบที่แท้จริงจาก AI
    const text = response.text() //ดึงเนื้อหาของคำตอบจาก AI ออกมาในรูปแบบข้อความ (string)

    return new Response(JSON.stringify({ message: text }), { //สร้างอ็อบเจกต์ Response เพื่อส่งกลับไปยังฝั่งไคลเอนต์
      //JSON.stringify({ message: text }) แปลงอ็อบเจกต์ JavaScript { message: text } ให้เป็น JSON string
      headers: { "Content-Type": "application/json" }, //headers: { "Content-Type": "application/json" } เป็นการระบุว่า Content-Type ของ Response คือ application/json ซึ่งสำคัญมากเพื่อให้ฝั่งไคลเอนต์ทราบวิธีการอ่านข้อมูล
    })
  } catch (error) { //หากเกิดข้อผิดพลาดในบล็อก try ข้อความข้อผิดพลาดจะถูกบันทึกลงใน console ของเซิร์ฟเวอร์
    console.error("Chat API error:", error) //หากเกิดข้อผิดพลาด จะส่ง Response กลับไปพร้อมกับสถานะ HTTP 500 Internal Server Error และข้อความแสดงข้อผิดพลาดที่เป็น JSON
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
