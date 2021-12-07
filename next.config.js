/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: '/',
        destination: '/photos',
        permanent: false
      },
      {
        source: '/photos',
        destination: '/photo',
        permanent: true
      },
      {
        source: '/tunes',
        destination: '/tune',
        permanent: true
      }
    ]
  }
}
