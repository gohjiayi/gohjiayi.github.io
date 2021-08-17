import React, { Component } from "react";
import ReactGA from "react-ga";
import $ from "jquery";
import "./App.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import About from "./Components/About";
import Resume from "./Components/Resume";
import Gallery from "./Components/Gallery";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab, faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faCubes,
  faUsers,
  faMicrophone,
  faCommentDots,
  faCode,
  faEnvelope,
  faRobot,
  faChartArea,
  faLaptop,
  faDatabase,
  faFastForward,
} from "@fortawesome/free-solid-svg-icons";
import dotenv from "dotenv";

library.add(
  fab,
  faLinkedin,
  faGithub,
  faCubes,
  faUsers,
  faMicrophone,
  faCommentDots,
  faCode,
  faEnvelope,
  faRobot,
  faChartArea,
  faLaptop,
  faDatabase,
  faFastForward
);
dotenv.config();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foo: "bar",
      resumeData: {},
    };

    const REACT_APP_GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID;
    ReactGA.initialize(REACT_APP_GA_TRACKING_ID);
    ReactGA.pageview(window.location.pathname);
  }

  getResumeData() {
    $.ajax({
      url: "./resumeData.json",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ resumeData: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.log(err);
        alert(err);
      },
    });
  }

  componentDidMount() {
    this.getResumeData();
  }

  render() {
    return (
      <div className="App">
        <Header data={this.state.resumeData.main} />
        <About data={this.state.resumeData.main} />
        <Resume data={this.state.resumeData.resume} />
        <Gallery data={this.state.resumeData.gallery} />
        <Footer data={this.state.resumeData.main} />
      </div>
    );
  }
}

export default App;
