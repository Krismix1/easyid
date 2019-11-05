module.exports = () => {
  console.log('hello there')
  return (req, res) => {
    return res.status(200).send('Hi from route again\r\n')
  }
}
