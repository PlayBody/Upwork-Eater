// import React, { useEffect, useState } from 'react';
// import logo from '../../assets/img/logo.svg';
// import Greetings from '../../containers/Greetings/Greetings';
// import './Popup.css';
// import { loadProfiles } from '../Util/io'
// import { Select } from 'antd'


// import Constant from '../constant';

// const { profiles, currentProfile } = Constant;

// const { Option } = Select;


// const Popup = () => {
//   const [save, setSave] = useState([]);

//   const handleClickReload = async () => {
//     const loads = await loadProfiles();
//     setSave(loads);
//   }

//   // const [flag, setFlag]=useState(false);

//   const handleClickStart = () => {
//       localStorage.setItem('flag', true);
//   }

//   const loadData = (personalData) => {
//     save.map((each) => {
//       if (each.profileName == personalData) {
//         // localStorage.setItem('currentProfile', JSON.stringify(each));
//         // localStorage.setItem('flag', false);
//         // alert(JSON.stringify(each));
//         chrome.storage.local.set({[currentProfile] : each});
//       }
//     })

//   }


//   useEffect(() => {
//     handleClickReload();
//   }, []);

//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/pages/Popup/Popup.jsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React!
//         </a>
//         <button onClick={handleClickReload}>Reload Save Data</button>
//         <Select style={{ width: 120 }} onChange={(value) => { loadData(value) }}>
//           {save.map((each, index) =>
//             <Option key={index} value={each.profileName}>{each.profileName}</Option>
//           )}
//         </Select>

//         <a
//           className="App-link"
//           href="file:///D:/www.w3schools.com/index.html"
//           target='_blank'
//           onClick={handleClickStart}
//         >
//           Start
//         </a>
//       </header>
//     </div>
//   );
// };

// export default Popup;


import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';



const Popup = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/Popup/Popup.jsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="http://localhost/autoInput/auto.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
      </header>
    </div>
  );
};

export default Popup;
