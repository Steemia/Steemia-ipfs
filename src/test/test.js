/* global describe it before done */

import { expect } from 'chai';
import supertest from 'supertest';
import app from '../server';

describe('GET /', () => {

    // Called once before any of the tests in this block begin.
    before((done) => {
        app.listen((err) => {
            if (err) return done(err);
            done();
        });
    });

    it('should send back a content type of text/html; charset=utf-8', (done) =>  {
        supertest(app)
            .get('/')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(200, (err) => {

                if (err) return done(err);
                done();
            });
    });

});

describe('GET /v0/upload', () => {

    // Called once before any of the tests in this block begin.
    before((done) => {
        app.listen((err) => {
            if (err) return done(err);
            done();
        });
    });

    it('should send back a content type of text/html; charset=utf-8', (done) =>  {
        supertest(app)
            .get('/v0/upload')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(200, (err) => {

                if (err) return done(err);
                done();
            });
    });

});

describe('POST /v0/upload', () => {

    // Called once before any of the tests in this block begin.
    before((done) => {
        app.listen((err) => {
            if (err) return done(err);
            done();
        });
    });

    it('should return the hash of the uploaded image', (done) =>  {
        supertest(app)
            .post('/v0/upload')
            .attach('file', __dirname + '/300.png')
            .expect(200, (err, res) => {

                if (err) return done(err);

                expect(res.body.hash).to.be.an('string');
                done();
            });
    });

});