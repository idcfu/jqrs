import Subject from './Subject';

const subject = new Subject();

const mockUpdateOptions = jest.fn((value: number) => value);

it('Subject', () => {
  subject.attach('optionsUpdate', mockUpdateOptions);
  subject.notify('optionsUpdate', 1);

  expect(mockUpdateOptions).toHaveBeenCalledWith(1);

  subject.detach('optionsUpdate', mockUpdateOptions);
  subject.notify('optionsUpdate', 1);

  expect(mockUpdateOptions).toHaveBeenCalledWith(1);
});
