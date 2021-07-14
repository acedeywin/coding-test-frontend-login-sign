export const errorResponse = (res, code) => {
  return res.status(code).send()
}

export const successResponse = (res, data) => {
  return res.send(data)
}
