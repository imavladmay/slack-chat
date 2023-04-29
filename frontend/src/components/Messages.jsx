import React from 'react';
import { Col, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { useWebSocket } from '../providers/WebSocketProvider';
import { chatSchema } from '../utils/validation';

const Messages = () => {
  const { t } = useTranslation();
  const { addMessageApi } = useWebSocket();

  const { username } = JSON.parse(localStorage.getItem('userData'));

  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const { messages } = useSelector((state) => state.messages);

  const currentChannelName = channels.length !== 0 ? channels.find((el) => el.id === currentChannelId).name : '';
  const messagesInCurrentChannel = messages.filter((el) => el.channelId === currentChannelId)
    .length;

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema: chatSchema,
    onSubmit: (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const { body } = values;
        const newMessage = {
          body,
          channelId: currentChannelId,
          username,
        };
        addMessageApi(newMessage);
        formik.resetForm();
      } catch (error) {
        setSubmitting(false);
        console.log('error.addMessage');
      }
    },
  });

  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>{`# ${currentChannelName}`}</b>
          </p>
          <span className="text-muted">{t('messagesCounter.messages', { count: messagesInCurrentChannel })}</span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5">
          {messagesInCurrentChannel !== 0 ? messages.map((el) => (
            <div className="text-break mb-2" key={el.id}>
              <b>{el.username}</b>
              {`: ${el.body}`}
            </div>
          )) : ''}
        </div>
        <div className="mt-auto px-5 py-3">
          <Form onSubmit={formik.handleSubmit} noValidate className="py-1 border rounded-2">
            <Form.Group className="input-group has-validation">
              <Form.Control
                name="body"
                aria-label={t('newMessage')}
                placeholder={t('placeholders.enterMessage')}
                className="border-0 p-0 ps-2"
                disabled={formik.isSubmitting}
                onChange={formik.handleChange}
                value={formik.values.body}
              />
              <Button
                type="submit"
                className="btn btn-group-vertical border-0"
                variant=""
                disabled={!formik.isValid || formik.isSubmitting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path
                    fill="evenodd"
                    d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                  />
                </svg>
                <span className="visually-hidden">{t('send')}</span>
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </Col>
  );
};

export default Messages;
