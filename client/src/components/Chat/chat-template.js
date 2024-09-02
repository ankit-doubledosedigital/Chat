import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Cropper from 'react-cropper';
// import 'cropperjs/dist/cropper.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Style/chat.css';
import axios from 'axios';







export const ChatBoxTemplate = ({
  seenMessageUsers = [],
  // groups = [],
  contactList = [],
  setDeleteContact,
  deleteContact,
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
  groupsNotificationCount,
  handleInputSearch,
  // fetchGroups,
  toggleDropdown,
  openDropdownId,
  pinGroup,
  groupInvite,
  setBlockUserDetails,
  blockUser,
  setClearChatDetails,
  muteGroupNotification,
  setDeleteOrLeaveChatDetails,
  selectGroupMode,
  setSelectGroupMode,
  setSelectGroup,
  selectGroup,
  router,
  chatType,
  filterChat,
  resetSearch,
  toggleBookmark,
  showBookMark,
  nameEditState,
  updateGroup,
  set,
  socket,

}) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [changeGroupName, setChangeGroupName] = useState('');

  const [newGroupProfileSrc, setNewGroupProfileSrc] = useState(null);
  let [searchString, setSearchString] = useState('');
  const [cropImgSrc, setCropImgSrc] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [localSearchString, setLocalSearchString] = useState(searchString);
  const [changeChat, setChangeChat] = useState(null);
  const [newMessageCounter, setNewMessageCounter] = useState(0);
  const [groupId, setGroupId] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);
  // modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

      const response = await axios.post('http://localhost:5000/chat/createGroup', formData, {
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
      const response = await axios.get('http://localhost:5000/chat/fetchGroups', {
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
      const response = await axios.delete(`http://localhost:5000/chat/deletegroup/`, {
        params: {
          uid: localStorage.getItem('userId'),
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

  const updateGroupName = async () => {
    if (!nameEditState.value.name) {
      // toast.message(toastMessage.GROUP_NAME, toastType.WARNING)
    }
    else {
      const response = await axios.put('http://localhost:5000/chat/updateGroup', {
        data: {
          _id: groupId.value,
          name: nameEditState.value.name,
          uid
        }
      })
      if (response.status == 200) {
        nameEditState.value.state = false
        currentGroup.value.name = nameEditState.value.name

        const index = groups.value.findIndex(obj => obj._id === currentGroup.value._id);

        // If object found, update its name
        if (index !== -1) {
          groups.value[index].name = nameEditState.value.name;
        }
        socket.emit("notification", [{ ownerId: currentGroup.value.uid, uid: uid, groupId: groupId.value, invitees: currentGroup.value.invitees, isDelete: false }])

      }
    }
  }






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
      <div className="container-xxl h-100 position-relative z-index-1">
        {!groups.length ? (
          <div className="display-center">
            <div className="video-outer-section">
              <div className="white-card video-section">
                <div className="text-center">
                  <img
                    src="../../../assets/images/chat-circle-image.png"
                    width="250"
                    alt="Chat Circle"
                  />
                  <h3>Create Your First Chat</h3>
                  <p>
                    Welcome to the Chat Circle! We’re excited to have you join our vibrant
                    community. The Chat Circle is a space where you can connect, share, and
                    engage with others who share your interests.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary mx-auto w-100"
                  data-bs-toggle="modal"
                  data-bs-target="#personalChatModel"
                >
                  New Chat
                </button>
              </div>

              <div className="white-card video-section">
                <div className="text-center">
                  <img
                    src="../../../assets/images/group-chat.svg"
                    width="250"
                    alt="Group Chat"
                  />
                  <h3>Create Your First Group</h3>
                  <p>
                    Welcome to the Chat Circle! We’re excited to have you join our vibrant
                    community. The Chat Circle is a space where you can connect, share, and
                    engage with others who share your interests.
                  </p>
                </div>
                <button
                  onClick={openNewGroupModal}
                  type="button"
                  className="btn btn-primary mx-auto w-100"
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
            <header>All Chats</header>
            {groups.map((group, g) => (
              <div key={g}>
                <p>{group.name}</p> {/* Assuming each group has a 'name' property */}

                <Button variant="primary" onClick={handleShow}>
                  Delete
                </Button>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>Do you really want to delete this group ?</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      No
                    </Button>
                    <Button variant="primary" onClick={deleteGroup} >
                      Yes
                    </Button>
                  </Modal.Footer>
                </Modal>
                {/* Update  */}
                <button
                  onClick={updateGroup}
                  type="button"
                  className="btn btn-primary mx-auto text-align-left"
                  data-bs-toggle="modal"
                  data-bs-target="#update-group-modal"
                >
                  Edit
                </button>

              </div>
            ))}
          </div>


        )}
      </div>
      {/* New Group Modal */}
      <div className="modal fade" id="new-group-modal" tabIndex="-1" aria-labelledby="newGroupModalLabel" aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title">Create New Group</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                {cropImgSrc && (
                  <div className="col-12 mt-3">
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
            </div>
            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-primary w-100"
                disabled={inProgress || !newGroupName.trim()}
                onClick={createNewGroup}
              >
                {inProgress ? 'Creating...' : 'Create Group'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Update Group Modal */}
      <div className="modal fade" id="update-group-modal" tabIndex="-1" aria-labelledby="newGroupModalLabel" aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title">Create New Group</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter group name"
                    value={changeGroupName}
                    onChange={(e) => set(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                {cropImgSrc && (
                  <div className="col-12 mt-3">
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
            </div>
            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-primary w-100"
                disabled={inProgress || !newGroupName.trim()}
                onClick={updateGroupName}
              >
                {inProgress ? 'Creating...' : 'Create Group'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* New Personal Chat Modal */}
      <div className="modal fade" id="personalChatModel" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title">Invite Contact</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <input
                    type="email"
                    className={`form-control ${fieldError ? 'is-invalid' : ''}`}
                    placeholder="Enter email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                  {fieldError && <div className="invalid-feedback">{fieldError}</div>}
                </div>
              </div>
            </div>
            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-primary w-100"
                disabled={!email || fieldError}
                onClick={inviteContact}
              >
                Invite
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {/* <div className="modal fade" id="deleteConfirmationModal" tabIndex="-1" data-bs-backdrop="static">
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
                  onClick={handleAction}
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
      </div> */}

    </>

  );
};
