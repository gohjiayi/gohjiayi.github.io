import React, { Component } from "react";
import Fade from "react-reveal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

class Header extends Component {
  render() {
    if (!this.props.data) return null;

    const name = this.props.data.name;
    const linkedin = this.props.data.social.linkedin;
    const github = this.props.data.social.github;
    const email = "mailto:" + this.props.data.social.email;

    return (
      <header id="home"
        style={{ backgroundImage: "url(/images/background.jpg)",
          height:"100vh",
          backgroundPosition:"center",
          backgroundRepeat:"no-repeat",
          backgroundSize:"cover"
        }}
      >

        <nav id="nav-wrap">
          <a className="mobile-btn" href="#nav-wrap" title="Show navigation">
            Show navigation
          </a>
          <a className="mobile-btn" href="#home" title="Hide navigation">
            Hide navigation
          </a>
          <ul id="nav" className="nav">
            <li className="current">
              <a className="smoothscroll" href="#home">
                Home
              </a>
            </li>
            <li>
              <a className="smoothscroll" href="#about">
                About
              </a>
            </li>
            <li>
              <a className="smoothscroll" href="#resume">
                Resume
              </a>
            </li>
            <li>
              <a className="smoothscroll" href="#portfolio">
                Portfolio
              </a>
            </li>
            <li>
              <a className="smoothscroll" href="#contact">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <div className="row banner">
          <div className="banner-text">
            <Fade bottom>
              <h1>{name}</h1>
            </Fade>
            <hr />
            <Fade bottom duration={2000}>
              <ul className="social">
                <li key="linkedin"><a href={linkedin} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faLinkedin}/></a></li>
                <li key="github"><a href={github} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faGithub}/></a></li>
                <li key="email"><a href={email} target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faEnvelope}/></a></li>
              </ul>
            </Fade>
          </div>
        </div>

        <p className="scrolldown">
          <a className="smoothscroll" href="#about">
            <i className="icon-down-circle"></i>
          </a>
        </p>
      </header>
    );
  }
}

export default Header;
