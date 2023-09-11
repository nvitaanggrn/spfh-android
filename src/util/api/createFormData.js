export default data => {
  const formData = new FormData();
  Object.keys(data).forEach(name => formData.append(name, data[name]));
  return formData;
};