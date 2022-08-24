import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";

import Spinner from "../../../../components/UI/Spinner/Spinner";

import { setPicturesModalOpened } from "../../../../store/reducers/global_info/global_info";

import { toast } from "../../../../utils/toast/toast";

import WalletApi from "../../../../utils/api/wallet";

import "../../../../config.js";

import "../modals.scss";

const Pictures = () => {
  const dispatch = useDispatch();
  const { is_pictures_modal_opened, pfps_loading } = useSelector(
    (state) => state.global_info
  );

  const [modalIsOpen, setIsOpen] = useState(is_pictures_modal_opened);

  useEffect(
    () => setIsOpen(is_pictures_modal_opened),
    [is_pictures_modal_opened]
  );

  const closeModal = () => {
    setIsOpen(false);
    dispatch(setPicturesModalOpened(false));
  };

  const onChangePfp = async (event) => {

    try {

      var pfp = document.getElementById("new-pfp");
      pfp.setAttribute("data-pfpuri", event.target.id);
      pfp.src = event.target.src;

      var pfp = document.getElementById("new-pfp");
      var uri = pfp.getAttribute("data-pfpuri");
      await WalletApi.changePfp(uri);
      toast.successMessage("Changed profile picture");
      global.config.pfpUri = uri;
      global.config.pfpSrc = pfp.src;


    } catch (error) { toast.errorMessage(error.response.data); }
    
    closeModal();

  };

  if (pfps_loading)
    return (
      <Modal
        className={"modal"}
        overlayClassName={"modal-overlay"}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        <header className="modal__header">
          <h2 className="modal__title">Choose Profile Picture</h2>
          <button
            className="modal__close"
            aria-label="Close"
            data-micromodal-close
            onClick={() => closeModal()}
          />
        </header>
        <main className="modal__content">
          <div className="spinner-container">
             <Spinner />
          </div>
        </main>
      </Modal>
    );

  return (
    <Modal
      className={"modal"}
      overlayClassName={"modal-overlay"}
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
    >
      <header className="modal__header">
        <h2 className="modal__title">Choose Profile Picture</h2>
        <button
          className="modal__close"
          aria-label="Close"
          data-micromodal-close
          onClick={() => closeModal()}
        />
      </header>
      <main className="modal__content">
        <div className="pfps">
          {global.config.images &&
            global.config.images.length !== 0 &&
            global.config.images.map((image) => {
              return (
                <div className="choose-pfp-container" key={Math.random()}>
                  <img
                    className="choose-pfp"
                    id={image.uri}
                    src={image.src}
                    onClick={(e) => onChangePfp(e)}
                    alt="pfp"
                  />
                </div>
              );
            })}
        </div>
      </main>
    </Modal>
  );
};

export default Pictures;
