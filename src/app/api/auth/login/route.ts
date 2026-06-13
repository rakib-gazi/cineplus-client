import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Admin } from "@/models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_me";

export async function POST(req: Request) {
  try {
    await dbConnect();

    // Auto-seed check: sync admin credentials with environment variables if they change
    const seedEmail = (process.env.INIT_ADMIN_EMAIL || "admin@tvf.com").toLowerCase();
    const seedPassword = process.env.INIT_ADMIN_PASSWORD || "adminpassword";

    const existingAdmin = await Admin.findOne({ email: seedEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(seedPassword, 10);
      const adminCount = await Admin.countDocuments();
      if (adminCount > 0) {
        // If an admin already exists under a different email, update it to match the new email and password
        await Admin.updateOne({}, {
          email: seedEmail,
          password: hashedPassword
        });
        console.log(`Updated existing admin credentials to: ${seedEmail}`);
      } else {
        // Otherwise, create the initial admin
        await Admin.create({
          email: seedEmail,
          password: hashedPassword,
        });
        console.log(`Auto-seeded initial admin credentials: ${seedEmail}`);
      }
    } else {
      // If the admin exists, verify if the password matches. If not, update it.
      const isPasswordMatch = await bcrypt.compare(seedPassword, existingAdmin.password);
      if (!isPasswordMatch) {
        const hashedPassword = await bcrypt.hash(seedPassword, 10);
        existingAdmin.password = hashedPassword;
        await existingAdmin.save();
        console.log(`Updated password for admin: ${seedEmail}`);
      }
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Sign Token
    const token = jwt.sign(
      { id: admin._id.toString(), email: admin.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set token inside HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Logged in successfully",
      admin: { email: admin.email },
    });
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
