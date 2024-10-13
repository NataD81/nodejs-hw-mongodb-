import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';


export const getAllContacts = async ({

  page,
  perPage,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',

  filter = {},
  userId,
}) => {
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId });




  if (filter.userId) {
    contactsQuery.where('userId').equals(filter.userId);
  }

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }


  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findById({ _id: contactId, userId });
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (contactId, userId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findByIdAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true, runValidators: true, ...options, },
  );

  return rawResult;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
};
