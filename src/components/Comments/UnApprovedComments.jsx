import React, {Component} from 'react';
import { Grid, Row, Col, Table } from "react-bootstrap";
import { Redirect } from 'react-router-dom';
import Card from "components/Card/Card.jsx";
import problemsApi from '../../services/problemsApi'
import { unApprovedCommentsArray } from "variables/Variables.jsx";
import commentApi from '../../services/commentApi';

class UnApprovedComments extends Component {
    state = {
      comments: [],
      error: '', 
      isFetching: false,
      refresh: false,
      redirect: false
    }

    componentWillMount() {
      this.setState({isFetching: true})
      commentApi.UnApprovedComments().then(result => {
        this.formatResponseForTable(result)
        console.dir(result)
        this.setState({isFetching: false})
      }).catch(error => {
        this.setState({error: error, isFetching: false})
      })
    }

    formatResponseForTable(response) {
      let array = [];
      let count = 1

      response.map((item, index) => {
        array.push([count++, item._id, item.comment, item.commented_at]);
      });
      this.setState({comments: array})
    }

    approveComment(commentId) {
      this.setState({isFetching: true})
      console.log(this.state.comments)
      commentApi.ApproveComment(commentId).then(result => {
        this.setState({isFetching: false})
        window.location.reload()
      }).catch(error => {
        this.setState({redirect: false, isFetching: false})
      })
    }

    render() {
      if(this.state.isFetching === true) {
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
                          {unApprovedCommentsArray.map((prop, key) => {
                            return <th key={key}>{prop}</th>;
                          })}
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                      {this.state.comments.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              return <td key={key}>{prop}</td>;
                            })}
                            <td><button onClick={() => this.approveComment(prop[1])}>Approve</button></td>
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

export default UnApprovedComments;