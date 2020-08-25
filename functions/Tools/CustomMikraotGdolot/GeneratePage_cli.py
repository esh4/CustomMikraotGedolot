import os
import argparse
from MikraotGedolotGenerator import MikraotGedolotGenerator, TemplateManager


def get_arguments():
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument('-b', type=str)
    arg_parser.add_argument('--out', type=str, required=False)
    arg_parser.add_argument('-t', type=str, required=False)
    arg_parser.add_argument('-c', type=str, nargs='+')

    args = arg_parser.parse_args()

    dir_path = os.path.dirname(os.path.realpath(__file__))
    os.chdir(dir_path)

    print(vars(args))

    book = args.b
    commentators = args.c
    output_file = args.out
    trans = args.t

    return book, commentators, output_file, trans


book, comms, out_file, trans = get_arguments()
tm = TemplateManager(out_file)
tm.config_env()

mg = MikraotGedolotGenerator(book, comms, trans)
data = mg.generate()
tm.render_template(data)
