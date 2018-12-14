import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import { deletePost, addLike, removeLike } from '../../actions/postActions';
import { getProfiles } from '../../actions/profileActions';

class PostItem extends Component {
  componentDidMount = () => {
    this.props.getProfiles();
  };

  onDeleteClick = (id) => {
    this.props.deletePost(id);
  };

  onLikeClick = (id) => {
    this.props.addLike(id);
  };

  onUnlikeClick = (id) => {
    this.props.removeLike(id);
  };

  findUserLike = (likes) => {
    const { auth } = this.props;
    if (likes.filter((like) => like.user === auth.user.id).length > 0) {
      return true;
    } else {
      return false;
    }
  };

  findHandleProfile = (profiles, postUser) => {
    let handle;
    if (profiles !== null && profiles.length > 0) {
      profiles.forEach((profile) => {
        if (profile.user._id === postUser) {
          handle = profile.handle;
        }
      });
    }
    return handle;
  };

  render() {
    const { post, auth, showActions } = this.props;

    const { profiles } = this.props.profile;

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <Link
              to={`/profile/${this.findHandleProfile(profiles, post.user)}`}
            >
              <img
                className="rounded-circle d-none d-md-block"
                src={post.avatar}
                alt=""
              />
            </Link>
            <br />

            <p className="text-center">
              <Link
                to={`/profile/${this.findHandleProfile(profiles, post.user)}`}
              >
                {post.name}
              </Link>
            </p>
          </div>
          <div className="col-md-10">
            <p className="lead">{post.text}</p>
            {showActions ? (
              <span>
                <button
                  type="button"
                  className="btn btn-light mr-1"
                  onClick={() => this.onLikeClick(post._id)}
                >
                  <i
                    className={classnames('fas fa-thumbs-up', {
                      'text-info': this.findUserLike(post.likes)
                    })}
                  />
                  <span className="badge badge-light">{post.likes.length}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-light mr-1"
                  onClick={() => this.onUnlikeClick(post._id)}
                >
                  <i className="text-secondary fas fa-thumbs-down" />
                </button>
                <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                  Comments
                </Link>
                {post.user === auth.user.id ? (
                  <button
                    type="button"
                    className="btn btn-danger mr-1"
                    onClick={() => {
                      this.onDeleteClick(post._id);
                    }}
                  >
                    <i className="fas fa-times" />
                  </button>
                ) : null}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
PostItem.propTypes = {
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  getProfiles: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

PostItem.defaultProps = {
  showActions: true
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { deletePost, addLike, removeLike, getProfiles }
)(PostItem);
