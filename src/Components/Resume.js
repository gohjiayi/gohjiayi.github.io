import React, { Component } from "react";
import Slide from "react-reveal";
import DevIcon from "devicon-react-svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Resume extends Component {

  render() {
    if (!this.props.data) return null;

    const education = this.props.data.education.map(function (education) {
      return (
        <div className="education-entry" key={education.school}>
          <h4>{education.school}</h4>
          <p className="info">
            {education.degree}<span>&bull;</span>{education.graduated}
          </p>
          <p>{education.description}</p>
        </div>
      );
    });

    const work = this.props.data.work.map(function (work) {
      return (
        <div className="work-entry" key={work.company}>
          <h4>{work.title}</h4>
          <p className="info">
            {work.company}<span>&bull;</span>{work.location}<span>&bull;</span>{work.years}
          </p>
          {work.description.map(function(sentence) {
            return (
              <p className="info-bullet"><span>&bull;</span> {sentence}</p>
            )
          })}
        </div>
      );
    });

    const technicalskills = this.props.data.technicalskills.map(function (skill) {
      var skillLower = skill.toLowerCase();
      return (
          <li key={skill}>{skill}<br/><DevIcon className="skill-icon" icon={skillLower} style={{fill:"#595959", width:"50px"}}/></li>
      );
    });

    const softskills = this.props.data.softskills.map(function (skill) {
      var skillName = skill.skill;
      var skillIcon = ["fas", skill.icon];
      return (
        <li key={skillName}>{skillName}<br/><FontAwesomeIcon icon={skillIcon} color={"#595959"} size="2x" /></li>
      );
    });

    return (
      <section id="resume">
        <Slide left duration={1300}>
          <div className="row work">
            <div className="three columns header-col">
              <h1>
                <span>Experience</span>
              </h1>
            </div>
            <div className="nine columns main-col">
              {work}
            </div>
          </div>
        </Slide>

        <Slide left duration={1300}>
          <div className="row education">
            <div className="three columns header-col">
              <h1>
                <span>Education</span>
              </h1>
            </div>

            <div className="nine columns main-col">
              <div className="row item">
                <div className="twelve columns">{education}</div>
              </div>
            </div>
          </div>
        </Slide>

        <Slide left duration={1300}>
          <div className="row skill">
            <div className="three columns header-col">
              <h1>
                <span>Skills</span>
              </h1>
            </div>

            <div className="nine columns main-col">
              <div className="skills">
                <h4>Technical Skills</h4>
                <ul className="technical-skills">
                  {technicalskills}
                </ul>
                <h4>Soft Skills</h4>
                <ul className="soft-skills">
                  {softskills}
                </ul>
              </div>
            </div>
          </div>
        </Slide>
      </section>
    );
  }
}

export default Resume;
