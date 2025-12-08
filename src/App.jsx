import React, { Component } from "react";
import ReactGA from "react-ga";
// Using Chakra for styling; remove legacy App.css
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import Resume from "./components/Resume";
import Showcase from "./components/Showcase";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCode,
  faBrain,
  faRocket,
  faCloud,
  faCube,
  faLayerGroup,
  faCubes,
  faUserTie,
  faHandshake,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
// Register only the solid icons referenced by string name in components
library.add(
  faCode,
  faBrain,
  faRocket,
  faCloud,
  faCube,
  faLayerGroup,
  faCubes,
  faUserTie,
  faHandshake,
  faUserFriends
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resumeData: {},
      activeSection: 'home',
    };

    // Use process.env for compatibility (defined in vite.config.js)
    const REACT_APP_GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID;
    
    // Only initialize Google Analytics if tracking ID is provided
    if (REACT_APP_GA_TRACKING_ID) {
      ReactGA.initialize(REACT_APP_GA_TRACKING_ID);
      ReactGA.pageview(window.location.pathname);
    } else {
      console.warn('Google Analytics tracking ID not found. Analytics will not be initialized.');
    }
  }

  getResumeData() {
    fetch("/resumeData.json", { cache: "no-cache" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => this.setState({ resumeData: data }))
      .catch((err) => {
        console.error(err);
        alert(err);
      });
  }

  componentDidMount() {
    this.getResumeData();
    this.initScrollSpy();
  }

  componentWillUnmount() {
    if (this._onScroll) window.removeEventListener('scroll', this._onScroll);
    if (this._onResize) window.removeEventListener('resize', this._onResize);
  }

  initScrollSpy() {
    const ids = ['home', 'about', 'resume', 'projects'];
    const getSections = () => ids.map(id => document.getElementById(id)).filter(Boolean);
    let ticking = false;

    const calcActive = () => {
      const sections = getSections();
      if (!sections.length) return;
      const navOffset = 80; // matches scrollMarginTop
      const probe = window.scrollY + navOffset + window.innerHeight * 0.1; // a bit below the top
      let current = sections[0].id;
      for (const el of sections) {
        const top = el.offsetTop;
        if (probe >= top) current = el.id;
      }
      if (current !== this.state.activeSection) this.setState({ activeSection: current });
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calcActive();
          ticking = false;
        });
        ticking = true;
      }
    };
    const onResize = onScroll;

    this._onScroll = onScroll;
    this._onResize = onResize;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    // seed
    calcActive();
  }

  render() {
    return (
      <div>
        <Header data={this.state.resumeData.main} active={this.state.activeSection} />
        <About data={this.state.resumeData.main} />
        <Resume data={this.state.resumeData.resume} />
        <Showcase data={this.state.resumeData.showcase} />
        <Footer data={this.state.resumeData.main} />
      </div>
    );
  }
}

export default App;
