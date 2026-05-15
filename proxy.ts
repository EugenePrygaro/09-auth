import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

// Хелпер для безпечної перевірки префіксів маршрутів (захищає від часткових збігів)
const checkRoute = (routes: string[], pathname: string) => 
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

// Функція для ручного розбору заголовка Set-Cookie з усіма його атрибутами
function parseSetCookie(cookieStr: string) {
  const parts = cookieStr.split(';').map(p => p.trim());
  if (parts.length === 0) return null;

  // Перша частина — це завжди key=value
  const [nameWithValue, ..._] = parts;
  const eqIdx = nameWithValue.indexOf('=');
  if (eqIdx === -1) return null;

  const name = nameWithValue.substring(0, eqIdx).trim();
  const value = nameWithValue.substring(eqIdx + 1).trim();

  // Об'єкт для опцій cookies Next.js
  const options: Record<string, any> = {
    path: '/', // значення за замовчуванням
    httpOnly: false,
    secure: false,
  };

  // Розбираємо мета-атрибути (Expires, Max-Age, Path, HttpOnly, Secure тощо)
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const lowerPart = part.toLowerCase();

    if (lowerPart.startsWith('expires=')) {
      const dateStr = part.substring(8).trim();
      options.expires = new Date(dateStr);
    } else if (lowerPart.startsWith('max-age=')) {
      const maxAgeStr = part.substring(8).trim();
      options.maxAge = Number(maxAgeStr);
    } else if (lowerPart.startsWith('path=')) {
      options.path = part.substring(5).trim();
    } else if (lowerPart === 'httponly') {
      options.httpOnly = true;
    } else if (lowerPart === 'secure') {
      options.secure = true;
    } else if (lowerPart.startsWith('samesite=')) {
      const sameSiteVal = part.substring(9).trim().toLowerCase();
      if (['lax', 'strict', 'none'].includes(sameSiteVal)) {
        options.sameSite = sameSiteVal;
      }
    }
  }

  return { name, value, options };
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = checkRoute(publicRoutes, pathname);
  const isPrivateRoute = checkRoute(privateRoutes, pathname);

  if (!accessToken) {
    if (refreshToken) {
      try {
        const data = await checkSession();
        const setCookie = data.headers['set-cookie'];

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
          
          for (const cookieStr of cookieArray) {
            const parsedCookie = parseSetCookie(cookieStr);
            if (!parsedCookie) continue;

            const { name, value, options } = parsedCookie;
            
            // Встановлюємо лише потрібні нам токени з їхніми рідними опціями
            if (name === 'accessToken' || name === 'refreshToken') {
              cookieStore.set(name, value, options);
            }
          }
          
          // Робимо редіректи після успішного оновлення сесії
          if (isPublicRoute) {
            return NextResponse.redirect(new URL('/', request.url), {
              headers: { Cookie: cookieStore.toString() },
            });
          }
          if (isPrivateRoute) {
            return NextResponse.next({
              headers: { Cookie: cookieStore.toString() },
            });
          }
        }
      } catch (error) {
        console.error('Failed to refresh session:', error);
        // Якщо сесію не вдалося оновити — поводимося так, ніби рефреш токен недійсний
      }
    }

    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isPrivateRoute) {
    return NextResponse.next();
  }
}

export const config = {
  // Залишаємо мачер, який перехоплює всі вкладені динамічні шляхи
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};