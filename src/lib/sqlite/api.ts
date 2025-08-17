import { NextRequest, NextResponse } from "next/server";
import { validateLoginForm, validateRegisterForm } from "../validation";
import { authenticateUser, createAssociate } from "./config";

export async function RegisterRequest(request: NextRequest) {
    try {
        const body = await request.json()

        const validation = validateRegisterForm(body);
        if (!validation.isValid) {
            return NextResponse.json(
                { error: validation.errors },
                { status: 400 }
            )
        }

        const associate = await createAssociate(body);
        if (!associate) {
            return NextResponse.json(
                { error: 'failed to create associate' },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { message: 'associate created successfully', user: associate },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error in register:', error)
        return NextResponse.json(
            { error: 'internal server error' },
            { status: 500 }
        )
    }
}

export async function LoginRequest(request: NextRequest) {
    try {
        const body = await request.json()

        const validation = validateLoginForm(body);
        if (!validation.isValid) {
            return NextResponse.json(
                { error: validation.errors },
                { status: 400 }
            )
        }

        const user = await authenticateUser(body.email, body.password);
        if (!user) {
            return NextResponse.json(
                { error: 'invalid credentials' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { message: 'login successful', user },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error in login:', error)
        return NextResponse.json(
            { error: 'internal server error' },
            { status: 500 }
        )
    }
}