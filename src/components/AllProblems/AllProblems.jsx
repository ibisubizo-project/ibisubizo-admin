import React, {Component} from 'react';
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Link } from 'react-router-dom';
import Card from "components/Card/Card.jsx";
import problemsApi from '../../services/problemsApi'
import { allProblemsArray, allProblemsData } from "variables/Variables.jsx";

class AllProblems extends Component {
    state = {
      problems: [],
      error: '', 
      isFetching: false
    }

    componentWillMount() {
      this.setState({isFetching: true})
      problemsApi.getAllProblems().then(result => {
        this.formatResponseForTable(result)
      }).catch(error => {
        this.setState({error: error})
      })
    }

    formatResponseForTable(response) {
      let array = [];
      let count = 1
      let status = ["Private", "Public"]
      response.map((item, index) => {
        let approved = (item.is_approved === true) ? "Approved": "Not Approved";
        console.dir(item)
        array.push([count++, item.title, item.text, approved, status[item.status], item.created_at, item._id]);
      });
      this.setState({problems: array})
    }

    render() {
      return (
        <div className="content">
          <Grid fluid>
            <Row>
              <Col md={12}>
                <Card
                  title="All Problems"
                  category=""
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                    <Table striped hover>
                      <thead>
                        <tr>
                          {allProblemsArray.map((prop, key) => {
                            return <th key={key}>{prop}</th>;
                          })}
                        </tr>
                      </thead>
                      <tbody>
                      {this.state.problems.map((props, key) => {
                        return (
                          <tr key={key}>
                            {props.map((prop, key) => {
                              return <td key={key}><Link to={`/post/${props[6]}`}>{prop}</Link></td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                    </Table>
                  }
                />
              </Col>
            </Row>
          </Grid>
        </div>
      );
    }
  }

export default AllProblems;