import cv2
import openface
import os
import argparse

fileDir = os.path.dirname(os.path.realpath(__file__))
modelDir = os.path.join(fileDir, 'batch-represent', 'models')
dlibModelDir = os.path.join(modelDir, 'dlib')
openfaceModelDir = os.path.join(modelDir, 'openface')

imgDim = 96

def preProcess(imgPath, saves=False, pathToSave=""):
    bgrImg = cv2.imread(imgPath)
    if bgrImg is None:
        raise Exception("Unable to load image: {}".format(imgPath))

    rgbImg = cv2.cvtColor(bgrImg, cv2.COLOR_BGR2RGB)

    bb1 = align.getLargestFaceBoundingBox(rgbImg)

    if bb1 == None:
        raise Exception("Unable to find a face: {}".format(imgPath))
        # TODO return a proper value

    reps = []
    # for bb in bbs:
    alignedFace = align.align(
        imgDim,
        rgbImg,
        bb1,
        landmarkIndices=openface.AlignDlib.OUTER_EYES_AND_NOSE)

    if alignedFace is None:
        raise Exception("Unable to align image: {}".format(imgPath))
        # TODO return a proper value

    if (saves):
        cv2.imwrite(pathToSave, alignedFace)
    
    return alignedFace

def createPaths():
    prefix = '../downloads'
    people = os.listdir(prefix)

    paths = {}
    for p in people:
        personImagesList = os.listdir(prefix + '/' + p)

        paths[p] = []
        for pi in personImagesList:
            if (pi.endswith(".jpg")):
                foldername = prefix + '/' + p 
                paths[p].append(foldername + '/' + pi)

    return paths

def doPreprocessing():
    paths = createPaths()
    for person in paths:
        imagesPaths = paths[person]
        for i in range(0, len(imagesPaths)):
            folderpath = 'batch-represent/data/' + person

            try:
                os.makedirs(folderpath)
            except OSError as e:
                print ("Creation of the directory %s failed %s" % (folderpath, e))
            else:
                print ("Successfully created the directory %s " % folderpath)

            newPath = folderpath + "/" + str(i) + ".jpg"
            preProcess(imagesPaths[i], True, newPath)

if __name__ == '__main__':
    dlibFacePredictor = os.path.join(
        dlibModelDir,
        "shape_predictor_68_face_landmarks.dat")

    align = openface.AlignDlib(dlibFacePredictor)
    # preProcess('../downloads/rouhani/1.jpg',True)
    doPreprocessing()
