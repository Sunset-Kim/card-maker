import React, { ReactEventHandler } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState, useRecoilValue } from 'recoil';
import { DatabaseService } from '../../services/database';
import { userIdAtom } from '../../state/auth';
import { ICardInfo, localCardsAtom } from '../../state/data';
import { isImgLoadingAtom } from '../../state/uploader';
import InputFile from '../input_file/input_file';
import './card_edit_form.module.css';

interface CardEditFormProps {
  card: ICardInfo;
}

const CardEditForm: React.FC<CardEditFormProps> = ({ card }) => {
  const userId = useRecoilValue(userIdAtom);
  const [localCards, setLocalCards] = useRecoilState(localCardsAtom);
  const isImgLoading = useRecoilValue(isImgLoadingAtom);
  const { register } = useForm();
  const databaseUploder = new DatabaseService();
  const { id, name, message, email, company, fileName, fileURL } = card;

  // 삭제
  const onDelete: ReactEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    if (!userId) return;
    if (isImgLoading) return alert('이미지를 교체 중 입니다.');
    databaseUploder.removeCard(userId, id.toString());
  };

  // 수정
  const onChange: ReactEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = e => {
    if (!userId) return;
    const currentValue = e.currentTarget.value;
    const currentName = e.currentTarget.name as keyof ICardInfo;
    const updatedCards = { ...localCards };
    updatedCards[id] = { ...updatedCards[id], [currentName]: currentValue };
    databaseUploder.addCard(userId, updatedCards[id]);
  };

  // 파일 업로드
  const onFileChange = (fileName: string, fileURL: string) => {
    if (!userId) return;
    const updateCards = { ...localCards };
    updateCards[id] = {
      ...updateCards[id],
      fileURL,
      fileName,
    };
    databaseUploder.addCard(userId, updateCards[card.id]);
  };

  return (
    <div className="w-full p-2 mb-4 border">
      <form className="w-full flex flex-col">
        <div className="flex">
          <label className="flex-1 flex items-center">
            <span className="sr-only ">Name</span>
            <span className="px-2 text-sm">name</span>
            <input
              className="placeholder:italic placeholder:text-gray-400 block bg-white w-full border border-gray-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
              placeholder="Search for anything..."
              type="text"
              name="name"
              value={name}
              onChange={onChange}
            />
          </label>
          <label className="flex-1 flex items-center">
            <span className="sr-only">Name</span>
            <span className="px-2 text-sm">company</span>
            <input
              {...register('company')}
              className="placeholder:italic placeholder:text-gray-400 block bg-white w-full border border-gray-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
              placeholder="Company here"
              type="text"
              name="company"
              value={company}
              onChange={onChange}
            />
          </label>
          <select className="flex-1 rounded-lg pl-2 border-2 border-transparent focus:border-sky-500 focus:outline-none">
            <option value="drak">drak</option>
          </select>
        </div>
        <div className="flex-1">
          <textarea
            className="w-full h-full resize-none rounded border-2 bg-white focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 px-3 py-2"
            name="message"
            cols={30}
            rows={5}
            value={message}
            onChange={onChange}
          ></textarea>
        </div>

        <div className="flex-1 flex">
          <InputFile fileName={fileName} onFileChange={onFileChange} />
          <button className="btn-delete flex-1 basis-1/3" onClick={onDelete}>
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default CardEditForm;