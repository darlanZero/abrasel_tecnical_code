import { NextRequest, NextResponse } from "next/server";
import { validateLoginForm, validateRegisterForm } from "../validation";
import { authenticateUser, createAssociate, deleteUser, getAllUsers, updateUser } from "./config";

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

export async function GetUsersRequest(request: NextRequest) {
    try {
        const users = await getAllUsers();

        return NextResponse.json(
            { users },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in get users:', error);
        return NextResponse.json(
            { error: 'internal server error' },
            { status: 500 }
        );
    }
}

export async function UpdateUserRequest(request: NextRequest) {
    try {
        const body = await request.json()
        const {userId, ...updateData} = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'userId is required' },
                { status: 400 }
            )
        }

        const success = await updateUser(userId, updateData);

        if (!success) {
            return NextResponse.json(
                { error: 'failed to update user' },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { message: 'user updated successfully' },
            { status: 200 }
        )
    } catch(error) {
        console.error('Error in update user:', error)
        return NextResponse.json(
            { error: 'internal server error' },
            { status: 500 }
        )
    }
}

export async function DeleteUserRequest(request: NextRequest) {
    try{
        const body = await request.json()
        const {userId} = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'userId is required' },
                { status: 400 }
            )
        }

        const success = await deleteUser(userId);

        if (!success) {
            return NextResponse.json(
                { error: 'failed to delete user' },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { message: 'user deleted successfully' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Error in delete user:', error)
        return NextResponse.json(
            { error: 'internal server error' },
            { status: 500 }
        )
    }
}