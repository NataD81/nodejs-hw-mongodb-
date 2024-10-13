

export const parseFilterParams = (query) => {
const { contactType, isFavorite } = query;

const parsedContactType = ['work', 'home', 'personal'].includes(contactType) ? contactType : undefined;
const parsedIsFavourite = isFavorite === 'true' ? true : isFavorite === 'false' ? false : undefined;

return{
    contactType: parsedContactType,
    isFavorite: parsedIsFavourite,
};
};
