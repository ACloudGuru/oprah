'use strict';

const { valuesIn, take, takeRight } = require('lodash');

jest.mock('aws-sdk', () => {
    return {
        SSM: function() {
            return {
                getParameters: mockGetParameters
            };
        }
    };
});

const mockGetParameters = jest.fn(() => ({ promise: mockPromise }))
const mockPromise = jest.fn()
    .mockImplementationOnce(() => Promise.resolve({
        Parameters: [
            {
                Name: '/path/to/FIRSTVAR',
                Value: '1st'
            },
            {
                Name: '/path/to/SECONDVAR',
                Value: '2nd'
            },
            {
                Name: '/path/to/THIRDVAR',
                Value: '3rd'
            }
        ],
        InvalidParameters: [
            '/path/to/FOURTHVAR',
            '/path/to/FIFTHVAR',
            '/path/to/SIXTHVAR',
            '/path/to/SEVENTHVAR',
            '/path/to/EIGTHVAR',
            '/path/to/NINTHVAR',
            '/path/to/TENTHVAR',
        ]
    }))
    .mockImplementationOnce(() => Promise.resolve({
        Parameters: [
            {
                Name: '/path/to/ELEVENTHVAR',
                Value: '11th'
            },
            {
                Name: '/path/to/TWELFTHVAR',
                Value: '12th'
            }
        ],
        InvalidParameters: []
    }));

const makeSsmEnvReader = require('./makeSsmEnvReader');

describe('makeSsmEnvReader', () => {
    describe('when the number of parameters exceed 10', () => {
        const handler = (event, context, callback) => ({ event, context, callback });
        const cb = () => {};
        const env = {
            SSM_FIRSTVAR: '/path/to/FIRSTVAR',
            SSM_SECONDVAR: '/path/to/SECONDVAR',
            SSM_THIRDVAR: '/path/to/THIRDVAR',
            SSM_FOURTHVAR: '/path/to/FOURTHVAR',
            SSM_FIFTHVAR: '/path/to/FIFTHVAR',
            SSM_SIXTHVAR: '/path/to/SIXTHVAR',
            SSM_SEVENTHVAR: '/path/to/SEVENTHVAR',
            SSM_EIGTHVAR: '/path/to/EIGTHVAR',
            SSM_NINTHVAR: '/path/to/NINTHVAR',
            SSM_TENTHVAR: '/path/to/TENTHVAR',
            SSM_ELEVENTHVAR: '/path/to/ELEVENTHVAR',
            SSM_TWELFTHVAR: '/path/to/TWELFTHVAR',
        };
        let result;
        beforeAll(() => {
            const lambdaHandler = makeSsmEnvReader({ env })(handler);
            const mockedContext = { existing: 'property' };

            return lambdaHandler({}, mockedContext, cb)
            .then(res => {
                result = res;
            });
        });

        it('sends getParameters in chunks of 10 when the requested parameter list exceeds 10', () => {
            expect(mockGetParameters.mock.calls[0][0]).toEqual({
                Names: take(valuesIn(env), 10),
                WithDecryption: true
            });

            expect(mockGetParameters.mock.calls[0][1]).toEqual({
                Names: [
                    '/path/to/ELEVENTHVAR',
                    '/path/to/TWELFTHVAR'
                ],
                WithDecryption: true
            });
        });

        it('add ssm parameters that exists to the event', () => {
            expect(result).toEqual({
                event: {
                    ssm: {
                        FIRSTVAR: '1st',
                        SECONDVAR: '2nd',
                        THIRDVAR: '3rd',
                        ELEVENTHVAR: '11th',
                        TWELFTHVAR: '12th'
                    }
                },
                context: {
                    existing: 'property'
                },
                callback: cb
            });
        });
    });
});