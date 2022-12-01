// Import stylesheets
import './style.css';

// Body element
const body = document.getElementById('body');

// Button elements
const btnSend = document.getElementById('btnSend');
const btnClose = document.getElementById('btnClose');
const btnApprove = document.getElementById('btnApprove');
const btnLogIn = document.getElementById('btnLogIn');
const btnLogOut = document.getElementById('btnLogOut');
const btnScanCode = document.getElementById('btnScanCode');
const btnOpenWindow = document.getElementById('btnOpenWindow');

// Profile elements
const email = document.getElementById('email');
const userId = document.getElementById('userId');
const pictureUrl = document.getElementById('pictureUrl');
const displayName = document.getElementById('displayName');
const statusMessage = document.getElementById('statusMessage');

// QR element
const code = document.getElementById('code');
const friendShip = document.getElementById('friendShip');

async function main() {
  // Initialize LIFF app
  await liff.init({ liffId: '1657674066-QAWyVgll' });
  // Try a LIFF function

  switch (liff.getOS()) {
    case 'android':
      body.style.backgroundColor = '#d1f5d3';
      break;
    case 'ios':
      body.style.backgroundColor = '#eeeeee';
      break;
  }

  if (!liff.isInClient()) {
    if (liff.isLoggedIn()) {
      btnLogIn.style.display = 'none';
      btnLogOut.style.display = 'none';
      btnApprove.style.display = 'block';
      getUserProfile();
      getFriendship();

      if (!liff.isLoggedIn()) {
        const destinationUrl = window.location.href;
        liff.login({ redirecturl: destinationUrl });
      }
      const profile = await liff.getProfile();
      const urlParams = new URLSearchParams(window.location.search);
      const destinationUrl = window.location.href;
      const ID = urlParams.get(profile.userId);
      const OTP = urlParams.get('OTP');
      const name = urlParams.get('name');
      const Location = urlParams.get('Location');
      const LiffID = profile.userId;

      // console.log(name);
      // console.log(OTP);
      // console.log(Location);
      // console.log(LiffID);

      var SendApprove = ` "Liff_ID" : "${LiffID}",
      "Name" : "${name}",
      "OTP" : "${OTP}",
      "Location" : "${Location}"`;

      console.log(SendApprove);
      const Http = new XMLHttpRequest();
      const url = 'https://171.100.141.54:5001/api/Otp/ApproveOtp';
      Http.open('POST', url);
      Http.send(SendApprove);

      console.log(Http.responseText);
      Http.onreadystatechange = (e) => {
        console.log(Http.responseText);
        console.log(e);
      };
    } else {
      btnLogIn.style.display = 'block';
      btnLogOut.style.display = 'none';
    }
  } else {
    btnSend.style.display = 'block';
    btnApprove.style.display = 'block';
    getUserProfile();
    getFriendship();
  }
  if (liff.isInClient() && liff.getOS() === 'android') {
    btnScanCode.style.display = 'block';
  }
  btnOpenWindow.style.display = 'block';
}

main();
{
}

async function getUserProfile() {
  const profile = await liff.getProfile();
  pictureUrl.src = profile.pictureUrl;
  userId.innerHTML = '<b>userId:</b> ' + profile.userId;
  statusMessage.innerHTML = '<b>statusMessage:</b> ' + profile.statusMessage;
  displayName.innerHTML = '<b>displayName:</b> ' + profile.displayName;
  email.innerHTML = '<b>email:</b> ' + liff.getDecodedIDToken().email;
}
btnLogIn.onclick = () => {
  liff.login();
};

btnLogOut.onclick = () => {
  liff.logout();
  window.location.reload();
};

async function sendMsg() {
  const profile = await liff.getProfile();
  if (
    liff.getContext().type !== 'none' &&
    liff.getContext().type !== 'external'
  ) {
    await liff.sendMessages([
      {
        type: 'text',
        text:
          'https://liff.line.me/1657674066-QAWyVgll?' + profile.userId + '&',
      },
    ]);
    liff.closeWindow();
  }
}

btnSend.onclick = () => {
  sendMsg();
};

async function shareMsg() {
  await liff.ApproveOTP([
    {
      type: 'image',
      originalContentUrl: 'https://d.line-scdn.net/stf/line-lp/2016_en_02.jpg',
      previewImageUrl: 'https://d.line-scdn.net/stf/line-lp/2016_en_02.jpg',
    },
  ]);
}

btnApprove.onclick = () => {
  shareMsg();
};

async function scanCode() {
  const result = await liff.scanCode();
  code.innerHTML = '<b>Code: </b>' + result.value;
}

btnApprove.onclick = () => {
  scanCode();
};

btnOpenWindow.onclick = () => {
  liff.openWindow({
    url: window.location.href,
    external: true,
  });
};

async function getFriendship() {
  let msg = 'Hooray! You and our chatbot are friend.';
  const friend = await liff.getFriendship();
  if (!friend.friendFlag) {
    msg =
      '<a href="https://line.me/R/ti/p/@BOT-ID">Follow our chatbot here!</a>';
  }
  friendShip.innerHTML = msg;
}
