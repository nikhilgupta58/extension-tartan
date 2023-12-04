export function verifyPan(pan) {
  const payload = {
    category: "individual-pii-data",
    type: "pan-detail-v2",
    applicationId: "Dashboard-realtime-KYC",
    data: { panNumber: pan },
    mode: "PROD",
  };
  const endpoint = `https://api-prod.tartanhq.com/aphrodite/api/tp/v1/verification`;
  const token = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJiYXRpa3N0YWdlZmFzdHRyYWNrIiwiZXhwIjoxNzAxNzAxNDI1LCJpYXQiOjE3MDE2ODM0MjV9.u0xszsidwoeqnVOONTnbgx2QbcNHDKcWlcmh86RBlA8Tv5WtlkfmaIu5nyYEVgyCWSNRdTIfg41VW15eHUVqew`;
  return fetch(endpoint, payload, { headers: token })
    .then((data) => data.json())
    .catch((error) => {
        console.log(error);
        return false;
    })
    .then((response) => {
        return response && response.response && response.response.isValid;
    });
}
