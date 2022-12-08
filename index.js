// Import stylesheets
import './style.css';

// Body element
const body = document.getElementById('body');

// Button elements
// const btnSend = document.getElementById('btnSend');
const btnClose = document.getElementById('btnClose');
const btnRegister = document.getElementById('btnRegister');
const btnLogIn = document.getElementById('btnLogIn');
const btnLogOut = document.getElementById('btnLogOut');
const btnOpenWindow = document.getElementById('btnOpenWindow');

// Profile elements
const email = document.getElementById('email');
const userId = document.getElementById('userId');
const pictureUrl = document.getElementById('pictureUrl');
const displayName = document.getElementById('displayName');
// const statusMessage = document.getElementById('statusMessage');
// QR element
const code = document.getElementById('code');
const friendShip = document.getElementById('friendShip');

async function main() {
  await liff.init({ liffId: '1657689397-eA1Wmlnr',withLoginOnExternalBrowser:true});

  if (!liff.isLoggedIn()) {
    const destinationUrl = window.location.href;
    liff.login({ redirectUri: destinationUrl });
  }
  const urlParams = new URLSearchParams(window.location.search);
  const paramter = urlParams.get('param');
  const name_p = urlParams.get('name');
  const profile = await liff.getProfile();
  const LiffID = profile.userId;

  console.log(name_p + ',' + LiffID + ',' + email.innerHTML);
  // otp = document.querySelector('#result').append(urlParams.get('param'));
  // document.querySelector('#otp').append(urlParams.get('param'));
  // document.querySelector('#result2').append(urlParams.get('name'));
  liff.ready.then(() => {
    if (liff.getOS() === 'android') {
      body.style.backgroundColor = '#d1f5d3';
    }
    if (!liff.isInClient()) {
      if (liff.isLoggedIn()) {
        btnLogIn.style.display = 'none';
        btnLogOut.style.display = 'block';
        btnRegister.style.display = 'block';
        getUserProfile();
      } else {
        btnLogIn.style.display = 'block';
        btnLogOut.style.display = 'none';
      }
    } else {
      // btnSend.style.display = 'block';
      btnRegister.style.display = 'block';
      getUserProfile();
    }
  });

  // 1.Initialize LIFF app)
  await liff.init({ liffId: '1657689397-eA1Wmlnr' });

  if (liff.isInClient() && liff.getOS() === 'android') {
    btnRegister.style.display = 'none';
  }
  btnOpenWindow.style.display = 'none';
}
main();

async function getUserProfile() {
  const profile = await liff.getProfile();
  pictureUrl.src = profile.pictureUrl;
  userId.innerHTML = '<b>UserID:</b> ' + profile.userId;
  // statusMessage.innerHTML = '<b>StatusMessage:</b> ' + profile.statusMessage;
  displayName.innerHTML = '<b>LineName:</b> ' + profile.displayName;
  email.innerHTML = '<b>Email:</b> ' + liff.getDecodedIDToken().email;
}

async function sendMsg() {
  if (
    liff.getContext().type !== 'none' &&
    liff.getContext().type !== 'external'
  ) {
    await liff.sendMessages([
      {
        type: 'text',
        text: 'This message was sent by sendMessages()',
      },
    ]);
    alert('Message sent');
  }
}
btnLogIn.onclick = () => {
  liff.login();
};

btnLogOut.onclick = () => {
  liff.logout();
  window.location.reload();
};
// btnSend.onclick = () => {
//   sendMsg();
// };

async function Register() {
  const profile = await liff.getProfile();
  post('https://171.100.141.54:5001/api/User/Register', {
    id: profile.userId,
    name: profile.displayName,
    email: liff.getDecodedIDToken().email,
  }).then((data) => console.log(data));
}

btnRegister.onclick = () => {
  confirm('Do you want to register?');
  Register();
};



// function getData() {
//   getUserProfile();
//   post('https://171.100.141.54:5001/api/Otp/ApproveOtp', {
//     user: userId.innerHTML,
//     otp: '980940',
//     email: email.innerHTML,
//   }).then((data) => console.log(data));
// }

const post = async (url, params) => {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
    },
  });

  const Resp = await response.json();
  const obj = JSON.parse(Resp);

  if (obj.StatusCode == 200) {
    alert(obj.Message);
  } else {
    alert(obj.Message);
  }

  return Resp;
};
