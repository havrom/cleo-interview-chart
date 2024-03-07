/**
 * utility function to execute GET request and parse json response
 * @param url request url
 * @returns typed data
 */
export async function fetcher<T>(url: string) {
    const res = await fetch(url)
    if(!res.ok) {
        throw new Error(`Error fetching data from ${url}`)
    }
    const data = await res.json() as T
    return data
}