import React, {Component} from 'react';
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import problemsApi from '../../services/problemsApi';

class PostDetail extends Component {

    componentDidMount() {
        const { match: { params } } = this.props;
        
        problemsApi.getProblem(params.post_id).then(result => {
            console.dir(result)
            this.setState({selectedProblem: result})
        })
    }

    render() {
        

        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                    <Col md={12}>
                        <Card
                            title="Post Detail"
                            category=""
                            ctTableFullWidth
                            ctTableResponsive
                            content={
                                <div>Post Detail</div>
                            } />
                    </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default PostDetail