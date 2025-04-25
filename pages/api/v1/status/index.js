function status(request, response) {
  response.status(200).json({ chave: "Muito Legal!!!" });
}

export default status;
