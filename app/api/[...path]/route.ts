import { NextRequest, NextResponse } from 'next/server';

// Backend URL - use localhost when running in Docker
const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:3001';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return proxyRequest(request, resolvedParams.path, 'GET');
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return proxyRequest(request, resolvedParams.path, 'POST');
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return proxyRequest(request, resolvedParams.path, 'PUT');
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return proxyRequest(request, resolvedParams.path, 'DELETE');
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const resolvedParams = await params;
    return proxyRequest(request, resolvedParams.path, 'PATCH');
}

async function proxyRequest(
    request: NextRequest,
    pathSegments: string[],
    method: string
) {
    try {
        const path = pathSegments.join('/');
        const url = `${BACKEND_URL}/${path}`;

        // Get search params from original request
        const searchParams = request.nextUrl.searchParams.toString();
        const fullUrl = searchParams ? `${url}?${searchParams}` : url;

        // Prepare headers
        const headers: HeadersInit = {};
        const contentType = request.headers.get('content-type');

        request.headers.forEach((value, key) => {
            const lowerKey = key.toLowerCase();
            // Skip host, content-type, and content-length for multipart/form-data
            if (lowerKey === 'host') return;
            // Skip content-type and content-length for FormData - let fetch set them
            if (lowerKey === 'content-type' && contentType?.includes('multipart/form-data')) return;
            if (lowerKey === 'content-length' && contentType?.includes('multipart/form-data')) return;
            headers[key] = value;
        });

        // Prepare request options
        const options: RequestInit = {
            method,
            headers,
        };

        // Add body for methods that support it
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
            if (contentType?.includes('multipart/form-data')) {
                // For file uploads, pass FormData directly
                // Don't set Content-Type - fetch will set it with boundary
                options.body = await request.formData();
            } else if (contentType?.includes('application/json')) {
                // For JSON, pass as text
                options.body = await request.text();
            } else {
                // For other types, pass as blob
                options.body = await request.blob();
            }
        }

        // Make request to backend
        const response = await fetch(fullUrl, options);

        // Get response body
        const responseContentType = response.headers.get('content-type');
        let data;

        if (responseContentType?.includes('application/json')) {
            data = await response.json();
        } else if (responseContentType?.includes('text')) {
            data = await response.text();
        } else {
            data = await response.blob();
        }

        // Return response with same status and headers
        return new NextResponse(
            typeof data === 'string' || data instanceof Blob ? data : JSON.stringify(data),
            {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            }
        );
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to proxy request to backend' },
            { status: 500 }
        );
    }
}
