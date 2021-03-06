import cv2
import openface
import os
import argparse

from Database import Database

fileDir = os.path.dirname(os.path.realpath(__file__))
modelDir = os.path.join(fileDir, 'batch-represent', 'models')
dlibModelDir = os.path.join(modelDir, 'dlib')
openfaceModelDir = os.path.join(modelDir, 'openface')

imgDim = 96

def preProcess(imgPath, saves=False, pathToSave=""):
    bgrImg = cv2.imread(imgPath)
    if bgrImg is None:
        print ("ERR_Unable to load image: {}".format(imgPath))
        return -1
        # raise Exception("Unable to load image: {}".format(imgPath))

    rgbImg = cv2.cvtColor(bgrImg, cv2.COLOR_BGR2RGB)

    bb1 = align.getLargestFaceBoundingBox(rgbImg)

    if bb1 == None:
        print ("ERR_Unable to find a face: {}".format(imgPath))
        return -1
        # raise Exception("Unable to find a face: {}".format(imgPath))
        # TODO return a proper value

    reps = []
    # for bb in bbs:
    alignedFace = align.align(
        imgDim,
        rgbImg,
        bb1,
        landmarkIndices=openface.AlignDlib.OUTER_EYES_AND_NOSE)

    if alignedFace is None:
        print ("ERR_Unable to align image: {}".format(imgPath))
        return -1
        # raise Exception("Unable to align image: {}".format(imgPath))
        # TODO return a proper value

    if (saves):
        cv2.imwrite(pathToSave, alignedFace)

    
    return 1

def createPaths(people):
    prefix = 'downloads'

    desiredPeople = []
    for p in people:
        pathToExamine = prefix + "/" + p
        if (os.path.isdir(pathToExamine) == True):
            desiredPeople.append(p)

    paths = {}
    for p in desiredPeople:
        personImagesList = os.listdir(prefix + '/' + p)

        paths[p] = []
        for pi in personImagesList:
            if (pi.endswith(".jpg")):
                foldername = prefix + '/' + p 
                paths[p].append(foldername + '/' + pi)

    return paths

def doPreprocessing(unpreprocessedProple):
    paths = createPaths(unpreprocessedProple)
    for person in paths:
        imagesPaths = paths[person]
        results = []
        folderpath = ""
        for i in range(0, len(imagesPaths)):
            results.append('')
            folderpath = 'image_processing_core/batch-represent/data/' + person
            try:
                os.makedirs(folderpath)
            except OSError as e:
                print ("Creation of the directory %s failed %s" % (folderpath, e))
            else:
                print ("Successfully created the directory %s " % folderpath)

            newPath = folderpath + "/" + str(i) + ".jpg"
            r = preProcess(imagesPaths[i], True, newPath)

            results[i] = r

        # print (results)
        # print (list(filter(lambda x : x == -1, results)))
        # return
        if (len(list(filter(lambda x : x == -1, results))) == len(imagesPaths)):
            print('TODO delete the person : ' + person)
            print (folderpath)
            deletePerson(person, folderpath)
        else:
            db.update('people', "name='{0}'".format(person), 'is_preprocessed=1')

def deletePerson(person, path):
    db.delete('people', "name='{0}'".format(person))
    if (len(path) > 0):
        os.rmdir(path)

if __name__ == '__main__':
    db = Database()
    db.connect_db()

    db.update('status', 'is_preprocessing=0', 'is_preprocessing=1')
    result = db.where('people','is_preprocessed=0')
    unpreprocessedProple = []
    for r in result:
        if(r[3] == 0):
            unpreprocessedProple.append(r[1])

    dlibFacePredictor = os.path.join(
        dlibModelDir,
        "shape_predictor_68_face_landmarks.dat")

    align = openface.AlignDlib(dlibFacePredictor)
    doPreprocessing(unpreprocessedProple)
