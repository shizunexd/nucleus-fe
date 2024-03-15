import { jwtDecode } from "jwt-decode";

export function getAuth() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth') as string) : null
    }
}

export function getAuthHeaderValue() {
    const token = getAuth()
    if (token) {
        return `Bearer ${token}`
    }
    return ''
}

export function setAuth(token: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth', token)
    }
}

export function clearAuth() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth')
    }

}

export function getCurrentUser() {
    const token = getAuth()
    if (token) {
        const decoded: any = jwtDecode(token);
        return decoded.username
    }
}

export function hasPermission(perm: string) {
    const token = getAuth()
    if (token) {
        const decoded: any = jwtDecode(token);
        const userPerms: Array<string> = []
        for (let role of decoded.role) {
            const permsArrayFromRole: Array<string> = JSON.parse(role.permissions)
            if (permsArrayFromRole.includes(perm)) return true
        }
    }
    return false
}