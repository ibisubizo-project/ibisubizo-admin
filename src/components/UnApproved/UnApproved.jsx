import React, {Component} from 'react';
import { Grid, Row, Col, Table } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import problemsApi from '../../services/problemsApi'
import { resolvedProblemsArray } from "variables/Variables.jsx";

class UnApproved extends Component {
    state = {
      problems: [],
      error: '', 
      isFetching: false,
      refresh: false,
    }

    componentWillMount() {
      this.setState({isFetching: true})
      problemsApi.getAllUnApprovedProblems().then(result => {
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
        array.push([count++, item.title, item.text, approved, "UnResolved", status[item.status], item.created_at, item._id]);
      });
      this.setState({problems: array})
    }

    approveProblem(problemId, index) {
      let payload = { id: problemId}
      this.setState({refresh: true})
      problemsApi.approveProblem(payload).then(result => {
        this.state.problems.splice(index, 1)
        this.setState({refresh: false})
      }).catch(error => {
        this.setState({refresh: false})
      })
    }

    render() {
      if(this.state.refresh == true) {
        return <div>Loading...</div>
      }
      return (
        <div className="content">
          <Grid fluid>
            <Row>
              <Col md={12}>
                <Card
                  title="UnApproved Problems"
                  category=""
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                    <Table striped hover>
                      <thead>
                        <tr>
                          {resolvedProblemsArray.map((prop, key) => {
                            return <th key={key}>{prop}</th>;
                          })}
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                      {this.state.problems.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              console.dir(prop)
                              return <td key={key}>{prop}</td>;
                            })}
                            <td><button onClick={() => this.approveProblem(prop[7], prop[0])}>Approve</button></td>
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

export default UnApproved;