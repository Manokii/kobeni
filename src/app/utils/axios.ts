export const apiAxios = async () => {
  const { default: axios } = await import("axios")
  return axios.create({
    baseURL: "/api",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  })
}
