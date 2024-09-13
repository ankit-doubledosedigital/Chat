import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Cropper from 'react-cropper';
// import 'cropperjs/dist/cropper.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Style/chat.css';
import axios from 'axios';
import io from 'socket.io-client';
import inviteService from '../service/InviteService';
const API_URL = 'http://localhost:5000';


// const socket = io('http://localhost:5000');







export const ChatBoxTemplate = ({
  seenMessageUsers = [],
  chatRoomName,
  // groups = [],

  // createPersonalChat,
  inviteContact,
  // searchString = '',
  isLoading,
  openNewGroupModal,
  formatTimeAgo,
  uid,
  clearChat,
  activeContact,
  isDelete,
  selectedGroup,
  deletePersonalChat,
  deleteOrLeaveChat,
  isMenuOpen = true,
  isViewGroup,
  currentGroup,

  nameEditState,
  updateGroup,
  socket,

}) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [changeGroupName, setChangeGroupName] = useState('');
  const [invitationCode, setinvitationCode] = useState([]);
  const [newGroupProfileSrc, setNewGroupProfileSrc] = useState(null);
  let [searchString, setSearchString] = useState('');
  const [cropImgSrc, setCropImgSrc] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [message, setMessage] = useState('');
  const [groupId, setGroupId] = useState(null);
  const [tempGroup, setTempGroup] = useState();
  // modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const photoUrl = localStorage.getItem('pictures');


  let [groups, setGroups] = useState([])

  uid = localStorage.getItem('userId')

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewGroupProfileSrc(file);
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value.trim();
    setEmail(email);
    validateEmail(email);
  };

  const validateEmail = (email) => {
    if (!email || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/.test(email)) {
      setFieldError('Invalid email address');
    } else {
      setFieldError('');
    }
  };

  const handleAction = () => {
    if (selectedGroup?.isGroup === false) {
      deletePersonalChat();
    } else {
      deleteOrLeaveChat(isDelete);
    }
  };

  const resetUpload = () => {
    setNewGroupProfileSrc(null);
    setCropImgSrc(null);
  };

  const createNewGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error('Please enter a group name.');
      return;
    }

    setInProgress(true);

    try {
      let formData = new FormData();
      const fileName = `${new Date().toISOString().replace(/[-:.]/g, '')}_${Math.floor(
        100000 + Math.random() * 900000
      )}.png`;
      if (newGroupProfileSrc) {
        formData.append('file', newGroupProfileSrc);
        formData.append('groupProfilePictureSrc', fileName);
      }

      formData.append('uid', uid);
      formData.append('isGroup', true);
      formData.append('name', newGroupName.trim());
      formData.append('invitees', JSON.stringify(seenMessageUsers));

      const response = await axios.post(`${API_URL}/chat/createGroup`, formData, {
        params: {
          uid: localStorage.userId,
          imgName: `${fileName}.png`,
          groupProfilePictureSrc: `${fileName}_picture.png`,
          prebuilt: false,
          name: newGroupName.trim()
        }
      }); {
        console.log("🚀 ~ response ~ response:", response)
        toast.success('Group created successfully!');
        setNewGroupName('');
        resetUpload();
        window.location.reload();


      };


    } catch (error) {
      toast.error('Failed to create group.');
    } finally {
      setInProgress(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat/fetchGroups`, {
        params: {
          uid: localStorage.getItem('userId') // Retrieve userId from localStorage
        }
      });
      setGroups(response.data.groups)
    } catch (error) {
      console.error("Error fetching groups:", error); // Log the error for debugging
    }
  };

  const deleteGroup = async () => {
    try {
      console.log('temp', tempGroup)
      const response = await axios.delete(`${API_URL}/chat/deletegroup/`, {
        params: {
          uid: localStorage.getItem('userId'),
          _id: tempGroup._id
        },
      });

      setGroups((prevGroups) => prevGroups.filter(group => group._id !== groupId));

      console.log("🚀 ~ deleteGroup ~ response:", response)
      console.log("Group deleted successfully");
      toast.success('Group deleted successfully!');
      window.location.reload();



    } catch (error) {
      console.error("Error deleting group:", error); // Log the error for debugging
      toast.error("Group Not Deleted")
    }
  };

  const setUpdate = (group) => {
    setTempGroup(group)

  }

  const updateGroupName = async () => {
    try {
      if (!changeGroupName) {
        // Show a warning toast if the name is not provided
        toast.warning(changeGroupName);
        return;
      }

      const response = await axios.put(`${API_URL}/chat/updateGroup`, {
        _id: tempGroup._id,
        name: changeGroupName,

      });
      console.log("🚀 ~ updateGroupName ~ response:", response)

      if (response.status === 200) {
        // Update the state after a successful update
        // nameEditState.state = false;
        // currentGroup.value.name = nameEditState.name;

        const index = groups.findIndex(obj => obj._id === tempGroup._id);

        // If the group is found, update its name in the list
        if (index !== -1) {
          groups[index].name = changeGroupName;
        }

        // Emit a socket event for the notification
        // socket.emit("notification", {
        //   ownerId: currentGroup.value.uid,
        //   uid: uid,
        //   groupId: groupId.value,
        //   // invitees: currentGroup.value.invitees,
        //   isDelete: false
        // });
      }
    } catch (error) {
      console.error('Error updating group name:', error);
      // Optionally, you can show an error toast message here
      toast.error('Failed to update group name');
    }
  };



  const setDeleteGroup = (group) => {
    setTempGroup(group)
    handleShow();

  };

  // Invite chat to Email

  const handleInviteChange = (e) => {
    setEmail(e.target.value);
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setFieldError('Email is required.');
      return;
    }

    setFieldError('');

    try {
      const invitationCode = generateInvitationCode(); // Generate or retrieve the invitation code as needed
      const response = await inviteService.sendInvite(invitationCode, email);
      console.log("🚀 ~ handleInviteSubmit ~ response:", response);

      setMessage('Invite sent successfully!');
      toast.success('Invite sent successfully!')
      setEmail(''); // Clear the input after successful invite
    } catch (error) {
      setMessage('Failed to send invite. Please try again.');
      toast.error('Failed to send invite. Please try again.')
    }
  };

  // Optional: Generate an invitation code if needed
  const generateInvitationCode = () => {
    return Math.random().toString(36).substr(2, 8); // Adjust length as necessary
  };

  const getClearStampDate = (group) => {
    // Implement this function according to your logic
  };

  const lastGroupMessage = (message) => {
    // Implement this function according to your logic
  };
  useEffect(() => {
    fetchGroups();
  }, []);
  return (
    <>
    <div className="container-xxl h-100 w-75 bg-warning p-5">
      <div className="container-xxl h-100 position-relative">
        {!groups.length ? (
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <div className="white-card p-4 mb-4">
              <div className="text-center">
                <img
                  src="../../../assets/images/chat-circle-image.png"
                  width="200"
                  alt="Chat Circle"
                  className="mb-3"
                />
                <h3>Create Your First Chat</h3>
                <p>
                  Welcome to the Chat Circle! We’re excited to have you join our
                  vibrant community where you can connect, share, and engage with
                  others.
                </p>
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  data-bs-toggle="modal"
                  data-bs-target="#personalChatModel"
                >
                  New Chat
                </button>
              </div>
            </div>
  
            <div className="white-card p-4">
              <div className="text-center">
                <img
                  src="../../../assets/images/group-chat.svg"
                  width="200"
                  alt="Group Chat"
                  className="mb-3"
                />
                <h3>Create Your First Group</h3>
                <p>
                  Create a group and connect with people sharing your interests.
                </p>
                <button
                  onClick={openNewGroupModal}
                  type="button"
                  className="btn btn-primary w-100"
                  data-bs-toggle="modal"
                  data-bs-target="#new-group-modal"
                >
                  New Group Chat
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5>All Chats</h5>
              <button
                className="btn btn-primary"
                onClick={openNewGroupModal}
                data-bs-toggle="modal"
                data-bs-target="#new-group-modal"
              >
                + New Group
              </button>
            </div>
  
            {groups.map((group, index) => (
              <div className="d-flex justify-content-between align-items-center mb-3" key={index}>
                <p className="mb-0">{group.name}</p>
                <div className="d-flex">
                  <button
                    onClick={() => setUpdate(group)}
                    type="button"
                    className="btn btn-sm btn-outline-secondary me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#update-group-modal"
                    
                  >
                    Edit
                  </button>
  
                  <button
                    onClick={() => setDeleteGroup(group)}
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#deleteConfirmationModal"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  
      {/* New Group Modal */}
      <div
        className="modal fade"
        id="new-group-modal"
        tabIndex="-1"
        aria-labelledby="newGroupModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title">Create New Group</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                required
              />
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
              />
              {cropImgSrc && (
                <div className="mt-3">
                  <img
                    src={URL.createObjectURL(cropImgSrc)}
                    alt="Cropped Preview"
                    className="img-thumbnail"
                  />
                  <button className="btn btn-danger mt-2" onClick={resetUpload}>
                    Remove Image
                  </button>
                </div>
              )}
            </div>
            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-primary w-100"
                disabled={inProgress || !newGroupName.trim()}
                onClick={createNewGroup}
              >
                {inProgress ? "Creating..." : "Create Group"}
              </button>
            </div>
          </div>
        </div>
      </div>
  
      {/* Edit Group Modal */}
      <div
        className="modal fade"
        id="update-group-modal"
        tabIndex="-1"
        aria-labelledby="updateGroupModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title">Edit Group</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter group name"
                value={changeGroupName}
                onChange={(e) => setChangeGroupName(e.target.value)}
                required
              />
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
              />
              {cropImgSrc && (
                <div className="mt-3">
                  <img
                    src={URL.createObjectURL(cropImgSrc)}
                    alt="Cropped Preview"
                    className="img-thumbnail"
                  />
                  <button className="btn btn-danger mt-2" onClick={resetUpload}>
                    Remove Image
                  </button>
                </div>
              )}
            </div>
            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-primary w-100"
                disabled={!changeGroupName.trim()}
                onClick={updateGroupName}
              >
                {inProgress ? "Updating..." : "Update Group"}
              </button>
            </div>
          </div>
        </div>
      </div>


       {/* Delete Confirmation Modal */}
        <div className="modal fade" id="deleteConfirmationModal" tabIndex="-1" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title">Delete Confirmation</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body pt-0">
              {isDelete ? (
                <p className="mb-0 fs-14">
                  Do you really want to delete this {selectedGroup?.isGroup === false ? 'chat' : 'group'}?
                </p>
              ) : (
                <p className="mb-0 fs-14">Do you really want to leave this group?</p>
              )}
              {selectedGroup?.uid === uid && isDelete && selectedGroup?.isGroup === true && selectedGroup?.invitees?.length > 0 && (
                <p className="mb-0 fs-12 mt-2">
                  <span className="text-danger">Note:</span> All the members will be removed.
                </p>
              )}
            </div>
            <div className="modal-footer border-0">
              <div className="d-flex w-100">
                <button
                  type="button"
                  className="btn btn-primary w-100 me-2"
                  data-bs-dismiss="modal"
                  onClick={deleteGroup}
                >
                  Yes
                </button>
                <button type="button" className="btn btn-default w-100" data-bs-dismiss="modal">
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    

      
  
      {/* Personal Chat Modal */}
      <div
        className="modal fade"
        id="personalChatModel"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title">Invite Contact</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="email"
                className={`form-control ${fieldError ? "is-invalid" : ""}`}
                placeholder="Enter email"
                value={email}
                onChange={handleInviteChange}
                required
              />
              {fieldError && (
                <div className="invalid-feedback">{fieldError}</div>
              )}
            </div>
            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-primary w-100"
                disabled={!email || fieldError}
                onClick={handleInviteSubmit}
              >
                Invite
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>

  </>
  

  );
};
